export interface SchemaToolObject {
  __schema__: {
    job?: string;
    values?: string[];
    separator?: string;
    custom?: (...values: any[]) => unknown;
  };
}

export type JoinOptions = {
  separator?: string;
};

export interface SchemaTools {
  join: (...args: (string | JoinOptions)[]) => SchemaToolObject;
  custom: (fn: (...values: any[]) => unknown, ...args: string[]) => SchemaToolObject;
}

const schemaTools: SchemaTools = {
  join: (...args) => {
    let config: JoinOptions = { separator: " " };
    const values: string[] = [];

    args.forEach(arg => {
      if (typeof arg === "string") {
        values.push(arg);
        return;
      }
      if (typeof arg === "object") {
        config = { ...config, ...arg };
      }
    });

    return {
      __schema__: {
        values,
        ...config,
        job: "join"
      }
    };
  },

  custom: (fn, ...args) => ({
    __schema__: {
      values: args,
      job: "custom",
      custom: fn
    }
  })
};

export default schemaTools;
