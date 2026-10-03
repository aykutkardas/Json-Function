import { describe, it, expectTypeOf } from "vitest";
import JsonFunction, {
  where,
  orderBy,
  limit,
  search,
  select,
  innerJoin,
  leftJoin,
  schema,
} from "../src/package/index.js";

type User = { id: number; name: string; city: string };
const users: User[] = [{ id: 1, name: "John", city: "Ankara" }];

describe("Type inference", () => {
  it("Keeps the item type through filtering and sorting.", () => {
    expectTypeOf(where(users, { city: "Ankara" })).toEqualTypeOf<User[]>();
    expectTypeOf(where(users, (wh) => ({ id: wh.gt(1) }))).toEqualTypeOf<User[]>();
    expectTypeOf(orderBy(users, "name", "DESC")).toEqualTypeOf<User[]>();
    expectTypeOf(limit(users, 1)).toEqualTypeOf<User[]>();
    expectTypeOf(search(users, "Jo", "name")).toEqualTypeOf<User[]>();
  });

  it("Narrows selected fields.", () => {
    expectTypeOf(select(users, ["id", "name"])).toEqualTypeOf<Pick<User, "id" | "name">[]>();
    expectTypeOf(select(users, "id")).toEqualTypeOf<Pick<User, "id">[]>();
  });

  it("Merges joined types.", () => {
    const pets = [{ ownerId: 1, pet: "cat" }];
    expectTypeOf(innerJoin(users, pets, "id", "ownerId")).toEqualTypeOf<
      (User & { ownerId: number; pet: string })[]
    >();
    expectTypeOf(leftJoin(users, pets, "id", "ownerId")).toEqualTypeOf<
      (User & Partial<{ ownerId: number; pet: string }>)[]
    >();
  });

  it("Returns an array for array input and an object for object input.", () => {
    expectTypeOf(schema(users, { id: "id" })).toBeArray();
    expectTypeOf(schema(users[0], { id: "id" })).not.toBeArray();
  });

  it("Lets the chain result type be given explicitly.", () => {
    expectTypeOf(JsonFunction.where({ id: 1 }).get<User>(users)).toEqualTypeOf<User[]>();
  });
});
