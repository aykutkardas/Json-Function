type JoinMethod = (...args: string[]) => SchemaToolObject;
type CustomMethod = (fn: Function, ...args: string[]) => SchemaToolObject;
type WithMethod = (separator: string) => SchemaToolObject;

export interface SchemaToolObject {
  __schema__: {
    job?: string;
    values?: string[];
    separator?: string;
    custom?: Function;
  }
}

export interface SchemaToolObject {
  join: JoinMethod;
  with: WithMethod;
  custom: CustomMethod;
}

class SchemaTool {
  join(...args: string[]) {
    let config: Object = { separator: ' ' };
    const values: string[] = [];

    args.forEach(arg => {
      if (typeof arg === 'string') {
        values.push(arg);
        return;
      }
      if (typeof arg === 'object') {
        config = { ...config, ...(<Object>arg) };
      }
    });

    return {
      __schema__: {
        values,
        ...config,
        job: 'join',
      }
    };
  }

  custom(fn: Function, ...args: string[]) {
    return {
      __schema__: {
        values: args,
        job: 'custom',
        custom: fn,
      }
    }
  }
}

export default new SchemaTool();