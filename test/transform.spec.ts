import { expect } from 'chai';
import { transform } from '../src';
import 'mocha';

const data = [
  {
    id: 1,
    user_id: 10,
    skils: [
      {
        id: 2,
        skill_name: 'Skill 1',
      }
    ],
    info: {
      info_adress: 'Adress',
      detail: {
        zip_code: 30000, 
      }
    }
  }
];

describe('Transform Function', () => {
  it('Check nested object.', () => {
    const result = transform(data);
    expect(result).to.deep.equal([
      {
        id: 1,
        userId: 10,
        skils: [
          {
            id: 2,
            skillName: 'Skill 1',
          }
        ],
        info: {
          infoAdress: 'Adress',
          detail: {
            zipCode: 30000, 
          }
        }
      }
    ]);
  });
});
