import { GraphQLScalarType } from 'graphql';

interface DateTimeScalar {
  KeyValue: GraphQLScalarType;
  typeDefs: string;
  resolvers: object;
}

export default DateTimeScalar;
