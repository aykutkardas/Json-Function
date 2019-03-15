type WhereToolObject = {
  value: any,
  type: string
}


class WhereTool {
  lt(number: number): WhereToolObject {
    return {
      value: number,
      type: '<'
    }
  }

  lte(number: number): WhereToolObject {
    return {
      value: number,
      type: '<='
    }
  }
  
  gt(number: number): WhereToolObject {
    return {
      value: number,
      type: '>'
    }
  }

  gte(number: number): WhereToolObject {
    return {
      value: number,
      type: '>='
    }
  }

  eq(value: any, strict?: boolean): WhereToolObject {
    return {
      value,
      type: strict ? '===' : '=='
    }
  }

  ne(value: any, strict?: boolean): WhereToolObject {
    return {
      value,
      type: strict ? '!==' : '!='
    }
  }

  in(value: any): WhereToolObject {
    return {
      value,
      type: 'includes'
    }
  }

  nin(value: any): WhereToolObject {
    return {
      value,
      type: '!includes'
    }
  }

  between(minValue: number, maxValue: number): WhereToolObject {
    return {
      value: [minValue, maxValue],
      type: 'between'
    }
  }

}

export default new WhereTool();