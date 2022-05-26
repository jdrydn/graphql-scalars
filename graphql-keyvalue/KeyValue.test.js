const assert = require('assert');
const { graphql, testGraphQlSchema } = require('../test/graphql');
const { pickValue } = require('../test/utils');
const { statics: { getKeyValue, setKeyValue } } = require('./schema.test');

describe('graphql-keyvalue', () => {
  before(testGraphQlSchema);

  it('should fetch a KeyValue type in a Query', async () => {
    const { data, errors } = await graphql({
      query: /* GraphQL */`
        query GetKeyValue {
          getKeyValue
        }
      `,
    });

    assert.deepStrictEqual({ data, errors }, {
      data: { getKeyValue },
      errors: null,
    });
  });

  it('should fetch a KeyValue type in a Mutation', async () => {
    const { data, errors } = await graphql({
      query: /* GraphQL */`
        mutation SetKeyValue($setKeyValue: KeyValue!) {
          setKeyValue(data: $setKeyValue)
        }
      `,
      variables: {
        setKeyValue,
      },
    });

    assert.deepStrictEqual({ data, errors }, {
      data: { setKeyValue },
      errors: null,
    });
  });

  it('should parse a literal KeyValue object in a Mutation', async () => {
    const { data, errors } = await graphql({
      query: /* GraphQL */`
        mutation ReflectKeyValue {
          reflectKeyValue(data: { a: 1, b: "c", d: false, e: null })
        }
      `,
    });

    assert.deepStrictEqual({ data, errors }, {
      data: { reflectKeyValue: { a: 1, b: 'c', d: false, e: null } },
      errors: null,
    });
  });

  it('should throw an error if a non-object is passed in a Mutation', async () => {
    const prefix = pickValue(process.env.GRAPHQL_VERSION || 16, {
      '14': 'Expected type KeyValue, found "HELLO-WORLD";',
      '15': 'Expected value of type "KeyValue", found "HELLO-WORLD";',
      '16': 'Expected value of type "KeyValue", found "HELLO-WORLD";',
    });

    const { data, errors } = await graphql({
      query: /* GraphQL */`
        mutation ReflectKeyValue {
          reflectKeyValue(data: "HELLO-WORLD")
        }
      `,
    });

    assert.deepStrictEqual({ data, errors }, {
      data: null,
      errors: [
        {
          locations: [ { column: 33, line: 3 } ],
          message: `${prefix} KeyValue cannot represent non-object value: "HELLO-WORLD"`,
        }
      ],
    });
  });

  describe('flatten', () => {
    const { flatten } = require('./KeyValue');
    before(() => assert(typeof flatten === 'function', 'Expected flatten to be a function'));

    it('should flatten an object', () => {
      const actual = flatten({
        a: 1,
        b: 'c',
        d: false,
        e: null,
        f: undefined,
        h: [ 1, 2, 3 ],
        i: { hello: 'world' },
      });
      assert.deepStrictEqual(actual, {
        a: 1,
        b: 'c',
        d: false,
        e: null,
        f: undefined,
        h: '[1,2,3]',
        i: '{"hello":"world"}',
      });
    });
  });

  describe('unflatten', () => {
    const { unflatten } = require('./KeyValue');
    before(() => assert(typeof unflatten === 'function', 'Expected flatten to be a function'));

    it('should flatten an object', () => {
      const actual = unflatten({
        a: 1,
        b: 'c',
        d: false,
        e: null,
        f: undefined,
        h: '[1,2,3]',
        i: '{"hello":"world"}',
      });
      assert.deepStrictEqual(actual, {
        a: 1,
        b: 'c',
        d: false,
        e: null,
        f: undefined,
        h: [ 1, 2, 3 ],
        i: { hello: 'world' },
      });
    });
  });
});
