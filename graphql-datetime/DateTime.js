const ms = require('ms');
const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

function assert(value, err) {
  if (Boolean(value) === false) {
    throw err;
  }
}

function parseDateMath(value) {
  if (typeof value === 'string' && (value.startsWith('NOW+') || value.startsWith('NOW-'))) {
    const i = value.startsWith('NOW-') ? 3 : 4;
    // @link https://npm.im/ms handles positives & negatives
    const offset = ms(value.substr(i).trim());
    return new Date(Date.now() + offset);
  } else if (value === 'NOW') {
    return new Date();
  } else {
    return new Date(value);
  }
}

const DateTimeScalar = new GraphQLScalarType({
  name: 'DateTime',
  description: 'Use JavaScript Date object for date/time fields',
  parseValue(value) {
    const date = parseDateMath(value);
    assert(!Number.isNaN(date.getTime()), new TypeError(`Value is not a valid Date: ${value}`));
    return date;
  },
  serialize(value) {
    let date = value;

    assert((date instanceof Date) || typeof date === 'string' || typeof date === 'number',
      new TypeError(`Value is not an instance of Date, Date string or number: ${value}`));

    if ([ 'string', 'number' ].includes(typeof value)) {
      date = new Date(value);
    }

    assert(!Number.isNaN(date.getTime()), new TypeError(`Value is not a valid Date: ${value}`));
    return date.toJSON();
  },
  parseLiteral(ast) {
    assert(ast.kind === Kind.STRING || ast.kind === Kind.INT,
      new TypeError(`Can only parse strings & integers to dates but got a: ${ast.kind}`));

    const date = ast.kind === Kind.INT ? new Date(Number(ast.value)) : parseDateMath(ast.value);
    assert(!Number.isNaN(date.getTime()), new TypeError(`Value is not a valid Date: ${ast.value}`));
    assert(ast.kind !== Kind.STRING || ast.value.startsWith('NOW') || ast.value === date.toJSON(),
      new TypeError(`Value is not a valid Date format (YYYY-MM-DDTHH:MM:SS.SSSZ): ${ast.value}`));

    return date;
  },
});

module.exports = {
  KeyValue: DateTimeScalar,
  // eslint-disable-next-line quotes
  typeDefs: /* GraphQL */`scalar DateTime`,
  resolvers: { DateTime: DateTimeScalar },
};
