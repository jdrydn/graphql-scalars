const assert = require('assert');
const { graphql, testGraphQlSchema } = require('../test/graphql');
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

    assert.deepStrictEqual(data, { getKeyValue });
    assert.deepStrictEqual(errors, null);
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

    assert.deepStrictEqual(data, { setKeyValue });
    assert.deepStrictEqual(errors, null);
  });
});
