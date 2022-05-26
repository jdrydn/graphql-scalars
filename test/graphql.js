const assert = require('assert');
const dateTimeCore = require('graphql-datetime');
const dateTimeTest = require('graphql-datetime/schema.test');
const keyValueCore = require('graphql-keyvalue');
const keyValueTest = require('graphql-keyvalue/schema.test');
const { graphql } = require('graphql');
const { makeExecutableSchema } = require('@graphql-tools/schema');

const { typeDefs: dateTimeCoreTypeDefs, resolvers: dateTimeCoreResolvers } = dateTimeCore;
const { typeDefs: dateTimeTestTypeDefs, resolvers: dateTimeTestResolvers } = dateTimeTest;

const { typeDefs: keyValueCoreTypeDefs, resolvers: keyValueCoreResolvers } = keyValueCore;
const { typeDefs: keyValueTestTypeDefs, resolvers: keyValueTestResolvers } = keyValueTest;

const typeDefs = /* GraphQL */`
  type Query {
    ping: String!
  }
  type Mutation {
    ping: String!
  }
`;

const resolvers = {
  Query: {
    ping: () => 'PONG',
  },
  Mutation: {
    ping: () => 'PONG',
  },
};

const schema = makeExecutableSchema({
  typeDefs: [
    typeDefs,
    dateTimeCoreTypeDefs, dateTimeTestTypeDefs,
    keyValueCoreTypeDefs, keyValueTestTypeDefs,
  ],
  resolvers: [
    resolvers,
    dateTimeCoreResolvers, dateTimeTestResolvers,
    keyValueCoreResolvers, keyValueTestResolvers,
  ],
});

async function executeGraphQl({ query, variables }) {
  try {
    const { data, errors } = await graphql({
      schema,
      source: query,
      variableValues: variables,
    });

    return {
      data: data ? JSON.parse(JSON.stringify(data)) : null,
      errors: Array.isArray(errors) ? JSON.parse(JSON.stringify(errors)) : null,
    };
  } catch (err) {
    return { errors: [ err ] };
  }
}

async function testGraphQlSchema() {
  const { data: queryData, errors: queryErrors } = await executeGraphQl({ query: '{ ping }' });
  assert.deepStrictEqual(queryData, { ping: 'PONG' });
  assert.deepStrictEqual(queryErrors, null);

  const { data: mutationData, errors: mutationErrors } = await executeGraphQl({ query: 'mutation { ping }' });
  assert.deepStrictEqual(mutationData, { ping: 'PONG' });
  assert.deepStrictEqual(mutationErrors, null);
}

module.exports = {
  graphql: executeGraphQl,
  testGraphQlSchema,
};
