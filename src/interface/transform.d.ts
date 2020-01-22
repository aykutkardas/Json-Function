export type TransformFunction = (
  data: Object[] | Object
) => Object[] | Object;

export type TransformKeysFn = (object: Object) => Object;

export type ProcessValFn = (val: any) => any;