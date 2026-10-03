// Usage: pnpm bench [itemCount]
import JsonFunction, {
  where,
  search,
  orderBy,
  schema,
  select,
  transform,
  innerJoin,
} from "../src/package";

const count = Number(process.argv[2]) || 200_000;

const data = Array.from({ length: count }, (_, i) => ({
  id: i,
  completed: i % 3 === 0,
  score: (i * 7919) % 1000,
  title: "task number " + i,
  user_info: { user_name: "user" + (i % 500), city_name: i % 2 ? "Istanbul" : "Ankara" },
  user: { name: "user" + (i % 500), city: i % 2 ? "Istanbul" : "Ankara" },
}));
const owners = Array.from({ length: 500 }, (_, i) => ({ ownerName: "user" + i, team: i % 7 }));

const cases: [string, () => unknown][] = [
  ["where", () => where(data, { completed: true })],
  ["where deep", () => where(data, { "user.city": "Ankara" }, { deep: true })],
  ["where wh.gt", () => where(data, (wh) => ({ score: wh.gt(500) }))],
  ["where OR (3 queries)", () => where(data, [{ score: 1 }, { score: 2 }, { completed: true }])],
  ["search 1 field", () => search(data, "number 19", "title")],
  ["search 2 fields, no hit", () => search(data, "zzz", ["title", "user.name"])],
  ["search case-insensitive", () => search(data, "NUMBER 19", "title", { caseSensitive: false })],
  ["orderBy", () => orderBy(data, "score")],
  ["orderBy deep", () => orderBy(data, "user.name", "ASC", { deep: true })],
  ["select", () => select(data, ["id", "score"])],
  ["schema", () => schema(data, { id: "id", name: "user.name", city: "user.city" })],
  ["transform", () => transform(data)],
  ["innerJoin", () => innerJoin(data, owners, "user.name", "ownerName")],
  [
    "chain where→orderBy→select→limit(10)",
    () => JsonFunction.where({ completed: true }).orderBy("score", "DESC").select(["id", "score"]).limit(10).get(data),
  ],
  ["chain orderBy→where→limit(10)", () => JsonFunction.orderBy("score").where({ completed: true }).limit(10).get(data)],
  ["chain where→select→limit(10)", () => JsonFunction.where({ completed: true }).select(["id"]).limit(10).get(data)],
];

const median = (values: number[]) => [...values].sort((a, b) => a - b)[values.length >> 1];

console.log(`${count.toLocaleString("en")} items, median of 7 runs\n`);

for (const [name, fn] of cases) {
  fn(); // warm up
  const times: number[] = [];
  for (let run = 0; run < 7; run++) {
    const start = performance.now();
    fn();
    times.push(performance.now() - start);
  }
  console.log(`${name.padEnd(40)} ${median(times).toFixed(1).padStart(8)} ms`);
}
