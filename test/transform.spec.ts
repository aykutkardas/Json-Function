import { describe, it, expect } from "vitest";
import { transform } from "../src/package";

const data = [
  {
    id: 1,
    user_id: 10,
    skils: [
      {
        id: 2,
        skill_name: "Skill 1"
      }
    ],
    info: {
      info_address: "Address",
      detail: {
        zip_code: 30000
      }
    }
  }
];

const dataObj = {
  id: 1,
  user_id: 10,
  skils: [
    {
      id: 2,
      skill_name: "Skill 1"
    }
  ],
  info: {
    info_address: "Address",
    detail: {
      zip_code: 30000
    }
  }
};

describe("Transform Function for Array", () => {
  it("Check nested object.", () => {
    const result = transform(data);
    expect(result).to.deep.equal([
      {
        id: 1,
        userId: 10,
        skils: [
          {
            id: 2,
            skillName: "Skill 1"
          }
        ],
        info: {
          infoAddress: "Address",
          detail: {
            zipCode: 30000
          }
        }
      }
    ]);
  });
});

describe("Transform Function for Array", () => {
  it("Check nested object.", () => {
    const result = transform(dataObj);
    expect(result).to.deep.equal({
      id: 1,
      userId: 10,
      skils: [
        {
          id: 2,
          skillName: "Skill 1"
        }
      ],
      info: {
        infoAddress: "Address",
        detail: {
          zipCode: 30000
        }
      }
    });
  });
});

describe("Transform edge cases", () => {
  it("Keeps primitives, nested arrays and non-plain objects intact.", () => {
    const date = new Date(0);
    const result = transform({
      tag_list: ["first_tag", "second_tag"],
      score_list: [1, 2],
      matrix_data: [[{ cell_value: 1 }], [2]],
      created_at: date,
      empty_value: null,
    });
    expect(result).to.deep.equal({
      tagList: ["first_tag", "second_tag"],
      scoreList: [1, 2],
      matrixData: [[{ cellValue: 1 }], [2]],
      createdAt: date,
      emptyValue: null,
    });
    expect((result as any).createdAt).to.equal(date);
  });
});
