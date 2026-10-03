import { expect } from "chai";
import { transform } from "../src/package";
import "mocha";

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

describe("Transform prototype safety", () => {
  it("Keeps a key that becomes __proto__ as a plain key.", () => {
    const result: any = transform(JSON.parse('{"name":"a","____proto____":{"is_admin":true}}'));
    expect(result.isAdmin).to.equal(undefined);
    expect(Object.getPrototypeOf(result)).to.equal(Object.prototype);
    expect(Object.prototype.hasOwnProperty.call(result, "__proto__")).to.equal(true);
  });
});
