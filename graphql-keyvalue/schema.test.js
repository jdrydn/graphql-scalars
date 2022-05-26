const assert = require('assert');
const { monotonicFactory } = require('ulid');

const ulid = monotonicFactory();

const typeDefs = /* GraphQL */`
  extend type Query {
    getKeyValue: KeyValue
  }
  extend type Mutation {
    setKeyValue(data: KeyValue): KeyValue
    reflectKeyValue(data: KeyValue): KeyValue
  }
`;

const statics = {
  getKeyValue: {
    space: ulid(),
    reality: ulid(),
    power: ulid(),
    mind: ulid(),
    time: ulid(),
    soul: ulid(),
  },
  setKeyValue: {
    space: ulid(),
    reality: ulid(),
    power: ulid(),
    mind: ulid(),
    time: ulid(),
    soul: ulid(),
  },
};

const resolvers = {
  Query: {
    getKeyValue() {
      return { ...statics.getKeyValue };
    },
  },
  Mutation: {
    setKeyValue(_, { data }) {
      assert.deepStrictEqual(data, statics.setKeyValue, 'Expected setKeyValue data variable to match the static data');
      return { ...statics.setKeyValue };
    },
    reflectKeyValue(_, { data }) {
      return { ...data };
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
  statics,
};
