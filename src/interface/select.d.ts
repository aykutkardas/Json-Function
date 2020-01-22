/**
 * The `Select` function is a practical method where you only get the desired fields of a json data.
 */
export type SelectFunction = (
  data: Object[], 
  columns: string | string[]
) => Object[];