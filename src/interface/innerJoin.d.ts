/**
 * The `innerJoin` function is used to join two arrays.
 */
export type InnerJoinFunction = (
  data: Object[],
  otherData: Object[],
  dataFieldName: string,
  otherDataFieldName: string
) => Object[];