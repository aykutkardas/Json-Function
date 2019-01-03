
type Join = (config?: Object, ...args: string[]) => any;


class Result {
  result: Object;
  constructor(result: Object = {}) {
    this.result = result;
  }
  with = (seperator: string) => ({...this.result, seperator})
}

class schemaTools {
  static join: Join = (...args) => {
    return new Result({ values: args, seperator: ' ' });
  }
}


export default schemaTools;