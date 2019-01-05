type JoinMethod = (...args: string[]) => SchemaToolObject;
type WithMethod = (seperator: string) => SchemaToolObject;

export interface SchemaToolObject {
  __schema__: {
    job?: string;
    values?: string[];
    seperator?: string;
  };
  join: JoinMethod;
  with: WithMethod;
}

class SchemaTool {
  __schema__: {
    job?: string;
    values?: string[];
    seperator?: string;
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
}

export default new SchemaTool();
