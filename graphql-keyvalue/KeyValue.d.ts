import { GraphQLScalarType } from 'graphql';

interface KeyValueScalar {
  KeyValue: GraphQLScalarType;
  typeDefs: string;
  resolvers: object;
  flatten(input: object): object;
  unflatten(input: object): object;
}

export default KeyValueScalar;
