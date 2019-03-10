import { isArray, isObject, isArrayOfObject } from "./type-check";
import getObjDeepProp from "./utils/get-obj-deep-prop";

type WhereFunction = (
  data: Object[],
  queries: Object | Object[],
  options?: {
    deep?: boolean;
  }
) => Object[];

enum ComparisonOperators {
  Less = '<',
  LessOrEqual = '<=',
  Greater = '>',
  GreaterOrEqual = '>=',
  Equal = '==',
  NotEqual = '!==',
  StrictEqual = '===',
  StrictNotEqual = '!===',
  In = 'in',
  NotIn = 'not in',
  Regex = 'regex'
}
const checkOperator = (operator: string, opcode?: any): (Error | void) => {
  if (!(Object.values(ComparisonOperators).includes(operator))) {
    return new Error(`The given operator is not supporting.`);
  }

  if ((operator == ComparisonOperators.In || operator == ComparisonOperators.NotIn) &&
    (opcode instanceof Array)) {
    return Error(`Opcode should be instance of an Array in 'in' and 'not in' comparisons`);
  }

}

/**
 * 
 * @param operator One of Comparison Operators
 * @param opcode The second opcode in one condition
 */
const logical = (operator: string, opcode: any): (Error | Object) => {
  checkOperator(operator, opcode);

  return { operator, opcode };
}

const where: WhereFunction = (data, queries, options) => {
  if (!isArray(data)) {
    return [];
  }

  let queriesArr: Object[];

  if (isObject(queries)) {
    queriesArr = [queries];
  } else if (isArrayOfObject(queries)) {
    queriesArr = <Object[]>queries;
  } else {
    return data;
  }

  let matchingItems: Object[] = [];
  let result: Object[] = [];

  queriesArr.forEach((query: (boolean | Object)) => {

    Object.keys(query).forEach(fieldName => {
      matchingItems = data.filter((item) => {
        let value = item[fieldName];
        if (options && options.deep) {
          value = getObjDeepProp(fieldName)(item);
        }

        if (query[fieldName] instanceof Object) {
          const { operator, opcode } = query[fieldName];
          checkOperator(operator);

          if (operator == ComparisonOperators.Regex) {
            const pattern = new RegExp(opcode);
            return pattern.test(value);
          }

          if (operator == ComparisonOperators.In) {
            return opcode.includes(value);
          }

          if (operator == ComparisonOperators.NotIn) {
            return !opcode.includes(value);
          }

          return eval(`${value} ${operator} ${opcode}`);
        }

        return value === query[fieldName];
      });
    });

    result = [...result, ...matchingItems];
    matchingItems = [];
  });

  return result;
};
export { logical, where };