const assert = require('assert');

const typeDefs = /* GraphQL */`
  extend type Query {
    getDateTime: DateTime
    getDateTimeString: DateTime
    getDateTimeNumber: DateTime
  }
  extend type Mutation {
    setDateTime(data: DateTime): DateTime
  }
`;

const statics = {
  getDateTime: new Date('1985-10-26 01:00:00'),
  setDateTime: new Date('1955-11-05 01:00:00'),
};

const resolvers = {
  Query: {
    getDateTime() {
      return statics.getDateTime;
    },
    getDateTimeString() {
      return statics.getDateTime.toISOString();
    },
    getDateTimeNumber() {
      return statics.getDateTime.getTime();
    },
  },
  Mutation: {
    setDateTime(_, { data }) {
      assert.deepStrictEqual(data, statics.setDateTime, 'Expected setDateTime data variable to match the static data');
      return statics.setDateTime;
    },
  },
};

module.exports = {
  typeDefs,
  resolvers,
  statics,
};
