/**
 * With the `orderBy` function you can reorder the data in your json array.
 */
export type OrderByFunction = (
  data: Object[],
  fieldName: string,
  order?: string
) => Object[];