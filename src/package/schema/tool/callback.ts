import { SchemaToolObject } from '../../../interface/schema';

export default {
  join: (...args: string[]): SchemaToolObject => {
    let config: Object = { separator: " " };
    const values: string[] = [];

    args.forEach(arg => {
      if (typeof arg === "string") {
        values.push(arg);
        return;
      }
      if (typeof arg === "object") {
        config = { ...config, ...(<Object>arg) };
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

  custom: (fn: Function, ...args: string[]): SchemaToolObject => ({
    __schema__: {
      values: args,
      job: "custom",
      custom: fn
    }
  })
};
