import { isArray, isObject, isArrayOfObject } from "./type-check";
import getObjDeepProp from "./utils/get-obj-deep-prop";

type WhereFunction = (
  data: Object[],
  queries: Object | Object[],
  options?: {
    deep?: boolean;
  },
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

const operatorsWithComparableArrayorObject = [
  ComparisonOperators.StrictEqual,
  ComparisonOperators.StrictNotEqual
];

/**
 * Checks the operator and the opcode are run with stable 
 * @param operator 
 * @param opcode 
 */
const checkOperator = (operator: string, opcode?: any): void => {

  console.log(operator, opcode);

  if (!(Object.values(ComparisonOperators).includes(operator))) {
    throw new Error(`The given operator is not supporting.`);
  }

  if ((operator == ComparisonOperators.In || operator == ComparisonOperators.NotIn) &&
    !(opcode instanceof Array)) {
    throw new Error(`Opcode should be instance of an Array in 'in' and 'not in' comparisons`);
  }

  if (!operatorsWithComparableArrayorObject.includes(operator as ComparisonOperators)
    && (opcode instanceof Array || opcode instanceof Object)) {
    throw new Error(`The operator should be one of these ${operatorsWithComparableArrayorObject.join(',')} when the opcode is Array or Object.`);
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

const where: WhereFunction = (data, queries, options?) => {
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
          checkOperator(operator,opcode);
          
          /* When the opcode is array or object then compare two same typed variables */
          if (operatorsWithComparableArrayorObject.includes(operator as ComparisonOperators)
            && (opcode instanceof Array || opcode instanceof Object)
          ) {
            if (operator == ComparisonOperators.StrictEqual) {
              return JSON.stringify(opcode) === JSON.stringify(value);
            } else {
              return !(JSON.stringify(opcode) === JSON.stringify(value));
            }
          }

          /* compare with regex */
          if (operator == ComparisonOperators.Regex) {
            const pattern = new RegExp(opcode);
            return pattern.test(value);
          }

          /* compare with includes */
          if (operator == ComparisonOperators.In) {
            return opcode.includes(value);
          }

          if (operator == ComparisonOperators.NotIn) {
            return !opcode.includes(value);
          }

          /* it could be dangerous but taken some preventions like checking operator. */
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