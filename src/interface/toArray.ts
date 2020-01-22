export type ToArrayConfig = {
  key: string,
};

export type ToArrayFunction = (
  data: Object, 
  config?: ToArrayConfig
) => Object[];