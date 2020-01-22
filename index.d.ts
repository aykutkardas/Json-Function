import { InnerJoinFunction } from "./src/interface/innerJoin";
import { LimitFunction } from "./src/interface/limit";
import { OrderByFunction } from "./src/interface/orderBy";
import { SchemaFunction } from "./src/interface/schema";
import { SelectFunction } from "./src/interface/select";
import { ToArrayFunction } from "./src/interface/toArray";
import { TransformFunction } from "./src/interface/transform";
import { WhereFunction } from "./src/interface/where";
import { JsonFunctionClass } from "./src/interface/main";

declare module "json-function" {
  export const innerJoin: InnerJoinFunction;

  // { where } Function
  export const where: WhereFunction;

  // { limit } Function
  export const limit: LimitFunction;

  // { orderBy } Function
  export const orderBy: OrderByFunction;

  // { schema } Function
  export const schema: SchemaFunction;

  // { transform } Function
  export const transform: TransformFunction;

  // { select } Function
  export const select: SelectFunction;

  const module: JsonFunctionClass;

  export default module;
}
