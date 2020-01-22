export type ToArrayConfig = {
  key: string,
};

/**
 * Converts objects into meaningful sequences.
 */
export type ToArrayFunction = (
  data: Object, 
  config?: ToArrayConfig
) => Object[];