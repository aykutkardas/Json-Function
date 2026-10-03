import { describe, it, expect } from "vitest";
import { readdirSync, readFileSync } from "fs";
import { join } from "path";
import { fileURLToPath } from "url";
import * as library from "../src/package/index.js";

// Runs the examples in docs/*.md so the documented outputs can't drift from
// the code. On each page, in order:
// - a ```js block starting with `const` is setup; its constants are kept
//   for the following blocks
// - a ```js block followed by an "Output:" line and another ```js block is
//   an example; it must be a single expression and its value must equal
//   the output block
// Other blocks (```ts signatures, imports, install commands) are not run.

const docsDir = fileURLToPath(new URL("../docs", import.meta.url));

const { default: JsonFunction, ...namedExports } = library;
const scopeFromLibrary: Record<string, unknown> = { ...namedExports, JsonFunction };

type Block = { lang: string; code: string; line: number; outputFollows: boolean };

const parseBlocks = (markdown: string): Block[] => {
  const blocks: Block[] = [];
  const lines = markdown.split(/\r?\n/);
  let open: { lang: string; start: number; body: string[] } | null = null;

  lines.forEach((line, index) => {
    const fence = line.match(/^```(\w*)\s*$/);
    if (!fence) {
      if (open) open.body.push(line);
      return;
    }
    if (open) {
      blocks.push({ lang: open.lang, code: open.body.join("\n"), line: open.start + 1, outputFollows: false });
      open = null;
    } else {
      open = { lang: fence[1], start: index, body: [] };
    }
  });

  // Mark blocks whose next non-empty line after the block is "Output:".
  const outputLines = new Set(
    lines.map((line, index) => (line.trim() === "Output:" ? index : -1)).filter((index) => index >= 0)
  );
  blocks.forEach((block) => {
    const end = block.line + block.code.split("\n").length;
    let next = end + 1;
    while (next < lines.length && lines[next].trim() === "") next++;
    block.outputFollows = outputLines.has(next);
  });

  return blocks;
};

const evaluate = (code: string, scope: Record<string, unknown>) => {
  const names = Object.keys(scope);
  return new Function(...names, code)(...names.map((name) => scope[name]));
};

const runPage = (file: string) => {
  const blocks = parseBlocks(readFileSync(join(docsDir, file), "utf8")).filter((block) => block.lang === "js");
  const scope: Record<string, unknown> = { ...scopeFromLibrary };
  let checked = 0;

  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    const code = block.code.replace(/^import .*$/gm, "").trim();

    if (block.outputFollows) {
      const output = blocks[i + 1];
      const expression = code.replace(/;\s*$/, "");
      let actual: unknown;
      try {
        actual = evaluate(`return (${expression});`, scope);
      } catch (error) {
        throw new Error(`${file}:${block.line} example failed: ${(error as Error).message}`);
      }
      const expected = evaluate(`return (${output.code.trim().replace(/;\s*$/, "")});`, {});
      expect(actual, `${file}:${block.line}`).toEqual(expected);
      checked++;
      i++;
    } else if (/^const /.test(code)) {
      const names = [...code.matchAll(/^const (\w+) =/gm)].map((match) => match[1]);
      Object.assign(scope, evaluate(`${code}\nreturn { ${names.join(", ")} };`, scope));
    }
  }

  return checked;
};

describe("Documentation examples", () => {
  const pages = readdirSync(docsDir).filter((file) => file.endsWith(".md"));

  for (const page of pages) {
    it(`docs/${page}`, () => {
      const outputs = readFileSync(join(docsDir, page), "utf8").match(/^Output:\s*$/gm) || [];
      expect(outputs.length, `docs/${page} has no examples with output`).toBeGreaterThan(0);
      // Every "Output:" must belong to a checked example, so none is skipped
      // because of a missing ```js tag or a typo.
      expect(runPage(page), `docs/${page}: checked examples`).toBe(outputs.length);
    });
  }
});
