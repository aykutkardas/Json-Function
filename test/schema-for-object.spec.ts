import { expect } from 'chai';
import { schema } from '../src';
import 'mocha';

const data = {
  id: 0,
  user: {
    firstname: 'John',
    lastname: 'Doe',
  },
  title: 'Book Name',
};

describe('Schema Function for Object', () => {
  it('Rearrange data test using the schema function.', () => {
    const result = schema(data, {
      book: {
        id: 'id',
        title: 'title',
      },
      firstname: 'user.firstname',
      lastname: 'user.lastname',
    });

    expect(result).to.deep.equal({
      firstname: 'John',
      lastname: 'Doe',
      book: {
        id: 0,
        title: 'Book Name',
      },
    });
  });
});

describe('Schema Tools Function for Object', () => {
  it('.join() method.', () => {
    const result = schema(data, (sc) => ({
      fullName: sc.join('user.firstname', 'user.lastname'),
      book: {
        id: 'id',
        title: 'title',
      },
    }));

    expect(result).to.deep.equal({
      fullName: 'John Doe',
      book: {
        id: 0,
        title: 'Book Name',
      },
    });
  });
  it('.join() method use with separator.', () => {
    const result = schema(data, (sc) => ({
      fullName: sc.join('user.firstname', 'user.lastname', { separator: '_' }),
      book: {
        id: 'id',
        title: 'title',
      },
    }));

    expect(result).to.deep.equal({
      fullName: 'John_Doe',
      book: {
        id: 0,
        title: 'Book Name',
      },
    });
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

    expect(result).to.deep.equal({
      fullName: 'JOHN DOE',
      book: {
        id: 0,
        title: 'Book Name',
      },
    });
  });
  it('complex sc methods.', () => {
    const result = schema(data, (sc) => ({
      fullName: sc.join('user.firstname', 'user.lastname'),
      book: {
        deepTitle: sc.custom((title: string) => title.toUpperCase(), "title"),
      },
      id: sc.custom((id: number) => id + 1, "id"),
    }));

    expect(result).to.deep.equal({
        fullName: 'John Doe',
        id: 1,
        book: {
          deepTitle: 'BOOK NAME',
        }
      });
  });
  it('duplicate .join() methods.', () => {
    const result = schema(data, (sc) => ({
      fullName: sc.join('user.firstname', 'user.lastname'),
      book: {
        deepTitle: sc.join('id', 'title'),
      },
      oneRowData: sc.join('id', 'title', 'user.firstname', 'user.lastname', { separator: '_' }),
    }));

    expect(result).to.deep.equal({
        fullName: 'John Doe',
        book: {
          deepTitle: '0 Book Name',
        },
        oneRowData: '0_Book Name_John_Doe'
      });
  });
});

describe('Schema Unexpected Data', () => {
  it('.join() method with null data.', () => {
    const result = schema(null, (sc) => ({
      fullName: sc.join('user.firstname', 'user.lastname'),
      book: {
        id: 'id',
        title: 'title',
      },
    }));

    expect(result).to.deep.equal(null);
  });
});