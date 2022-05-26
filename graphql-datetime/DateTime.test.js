const assert = require('assert');
const rewire = require('rewire');
const { graphql, testGraphQlSchema } = require('../test/graphql');
const { pickValue } = require('../test/utils');
const { statics: { getDateTime, setDateTime } } = require('./schema.test');

describe('graphql-datetime', () => {
  before(testGraphQlSchema);

  it('should fetch a DateTime type in a Query', async () => {
    const { data, errors } = await graphql({
      query: /* GraphQL */`
        query GetDateTime {
          getDateTime
        }
      `,
    });

    assert.deepStrictEqual({ data, errors }, {
      data: { getDateTime: getDateTime.toISOString() },
      errors: null,
    });
  });

  it('should fetch a DateTime type in a Mutation', async () => {
    const { data, errors } = await graphql({
      query: /* GraphQL */`
        mutation SetDateTime($setDateTime: DateTime!) {
          setDateTime(data: $setDateTime)
        }
      `,
      variables: {
        setDateTime,
      },
    });

    assert.deepStrictEqual({ data, errors }, {
      data: { setDateTime: setDateTime.toISOString() },
      errors: null,
    });
  });

  it('should parse a returned string as a DateTime type in a Query', async () => {
    const { data, errors } = await graphql({
      query: /* GraphQL */`
        query GetDateTime {
          getDateTimeString
        }
      `,
    });

    assert.deepStrictEqual({ data, errors }, {
      data: { getDateTimeString: getDateTime.toISOString() },
      errors: null,
    });
  });

  it('should parse a returned number as a DateTime type in a Query', async () => {
    const { data, errors } = await graphql({
      query: /* GraphQL */`
        query GetDateTime {
          getDateTimeNumber
        }
      `,
    });

    assert.deepStrictEqual({ data, errors }, {
      data: { getDateTimeNumber: getDateTime.toISOString() },
      errors: null,
    });
  });

  it('should parse a literal DateTime string in a Mutation', async () => {
    const { data, errors } = await graphql({
      query: /* GraphQL */`
        mutation SetDateTime {
          setDateTime(data: "1955-11-05T01:00:00.000Z")
        }
      `,
    });

    assert.deepStrictEqual({ data, errors }, {
      data: { setDateTime: setDateTime.toISOString() },
      errors: null,
    });
  });

  it('should parse a literal DateTime number in a Mutation', async () => {
    const { data, errors } = await graphql({
      query: /* GraphQL */`
        mutation SetDateTime {
          setDateTime(data: -446770800000)
        }
      `,
    });

    assert.deepStrictEqual({ data, errors }, {
      data: { setDateTime: setDateTime.toISOString() },
      errors: null,
    });
  });

  it('should throw an error if a literal boolean is passed in a Mutation', async () => {
    const prefix = pickValue(process.env.GRAPHQL_VERSION, {
      '14': 'Expected type DateTime, found false;',
      '15': 'Expected value of type "DateTime", found false;',
      '16': 'Expected value of type "DateTime", found false;',
    });

    const { data, errors } = await graphql({
      query: /* GraphQL */`
        mutation SetDateTime {
          setDateTime(data: false)
        }
      `,
    });

    assert.deepStrictEqual({ data, errors }, {
      data: null,
      errors: [
        {
          locations: [ { column: 29, line: 3 } ],
          message: `${prefix} Can only parse strings & integers to dates but got a: BooleanValue`,
        }
      ],
    });
  });

  describe('parseDateMath', () => {
    const DateTimeScalar = rewire('./DateTime');
    const parseDateMath = DateTimeScalar.__get__('parseDateMath');

    before(() => assert(typeof parseDateMath === 'function', 'Expected parseDateMath to be a function'));

    it('should parse a date in the future', () => {
      const actual = parseDateMath('NOW+1m');
      const expected = new Date(Date.now() + (60 * 1000));
      assert.deepStrictEqual(actual, expected);
    });

    it('should parse a date in the past', () => {
      const actual = parseDateMath('NOW-10m');
      const expected = new Date(Date.now() - (10 * 60 * 1000));
      assert.deepStrictEqual(actual, expected);
    });

    it('should parse a date in the present', () => {
      const actual = parseDateMath('NOW');
      const expected = new Date();
      assert.deepStrictEqual(actual, expected);
    });
  });
});
