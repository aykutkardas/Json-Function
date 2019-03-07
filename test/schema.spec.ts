import { expect } from 'chai';
import { schema } from '../src';
import 'mocha';

const data = [
  {
    id: 0,
    user: {
      firstname: 'John',
      lastname: 'Doe',
    },
    title: 'Book Name',
  },
  {
    id: 1,
    user: {
      firstname: 'Johnny',
      lastname: 'Doe',
    },
    title: 'Book Name 2',
  },
];

describe('Schema Function', () => {
  it('Rearrange data test using the schema function.', () => {
    const result = schema(data, {
      book: {
        id: 'id',
        title: 'title',
      },
      firstname: 'user.firstname',
      lastname: 'user.lastname',
    });

    expect(result).to.deep.equal([
      {
        firstname: 'John',
        lastname: 'Doe',
        book: {
          id: 0,
          title: 'Book Name',
        },
      },
      {
        firstname: 'Johnny',
        lastname: 'Doe',
        book: {
          id: 1,
          title: 'Book Name 2',
        },
      },
    ]);
  });
});

describe('Schema Tools Function', () => {
  it('.join() method.', () => {
    const result = schema(data, (sc) => ({
      fullName: sc.join('user.firstname', 'user.lastname'),
      book: {
        id: 'id',
        title: 'title',
      },
    }));

    expect(result).to.deep.equal([
      {
        fullName: 'John Doe',
        book: {
          id: 0,
          title: 'Book Name',
        },
      },
      {
        fullName: 'Johnny Doe',
        book: {
          id: 1,
          title: 'Book Name 2',
        },
      },
    ]);
  });
  it('.join().with() method.', () => {
    const result = schema(data, (sc) => ({
      fullName: sc.join('user.firstname', 'user.lastname').with('_'),
      book: {
        id: 'id',
        title: 'title',
      },
    }));

    expect(result).to.deep.equal([
      {
        fullName: 'John_Doe',
        book: {
          id: 0,
          title: 'Book Name',
        },
      },
      {
        fullName: 'Johnny_Doe',
        book: {
          id: 1,
          title: 'Book Name 2',
        },
      },
    ]);
  });
  it('.custom() method.', () => {
    const result = schema(data, (sc) => ({
      fullName: sc.custom((firstname: string, lastname: string) => {
        return firstname.toUpperCase() + ' ' + lastname.toUpperCase();
      }, 'user.firstname', 'user.lastname'),
      book: {
        id: 'id',
        title: 'title',
      },
    }));

    expect(result).to.deep.equal([
      {
        fullName: 'JOHN DOE',
        book: {
          id: 0,
          title: 'Book Name',
        },
      },
      {
        fullName: 'JOHNNY DOE',
        book: {
          id: 1,
          title: 'Book Name 2',
        },
      },
    ]);
  });
});
