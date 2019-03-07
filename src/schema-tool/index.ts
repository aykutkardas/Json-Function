import { schema } from "..";

type JoinMethod = (...args: string[]) => SchemaToolObject;
type CustomMethod = (fn: Function, ...args: string[]) => SchemaToolObject;
type WithMethod = (seperator: string) => SchemaToolObject;

export interface SchemaToolObject {
  __schema__: {
    job?: string;
    values?: string[];
    seperator?: string;
    custom?: Function;
  };
  join: JoinMethod;
  with: WithMethod;
  custom: CustomMethod;
}

class SchemaTool {
  __schema__: {
    job?: string;
    values?: string[];
    seperator?: string;
    custom?: Function;
  };

  constructor() {
    this.__schema__ = {};
  }

  join(...args: string[]) {
    this.__schema__.values = args;
    this.__schema__.job = "join";
    return this;
  }

  with(seperator: string) {
    this.__schema__.seperator = seperator;
    return this;
  }

  custom(fn: Function, ...args: string[]) {
    this.__schema__.values = args;
    this.__schema__.job = "custom";
    this.__schema__.custom = fn;
    return this;
  }
}

export default new SchemaTool();
