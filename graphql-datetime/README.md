# @jdrydn/graphql-datetime

[![NPM](https://badge.fury.io/js/@jdrydn%2Fgraphql-datetime.svg)](https://npm.im/@jdrydn/graphql-datetime)
[![CI](https://github.com/jdrydn/graphql-scalars/actions/workflows/ci.yml/badge.svg)](https://github.com/jdrydn/graphql-scalars/actions/workflows/ci.yml)

Standalone GraphQL Scalar type for Date values in JavaScript.

```graphql
type User {
  id: ID!
  name: String!
  createdAt: DateTime!
  lastActiveAt: DateTime!
}

extend type Query {
  user: User!
}

extend type Mutation {
  setUserLastActiveAt(id: ID!, lastActiveAt: lastActiveAt!): Boolean!
}
```

## Install

```
$ npm install --save graphql @jdrydn/graphql-datetime
```

From your codebase, you can either use predefined items (type definition & resolver) directly in your project or define the scalar yourself & include the scalar instance in your resolvers.

The following example uses [`graphql-tools`](https://npm.im/graphql-tools) & the predefined items:

```js
const assert = require('assert');
const { typeDefs: dateTimeTypeDefs, resolvers: dateTimeResolvers } = require('@jdrydn/graphql-datetime');

const typeDefs = /* GraphQL */`
  type User {
    id: ID!
    name: String!
    createdAt: DateTime!
    lastActiveAt: DateTime!
  }

  extend type Query {
    user: User!
  }

  extend type Mutation {
    setUserLastActiveAt(id: ID!, lastActiveAt: lastActiveAt!): Boolean!
  }
`;

const resolvers = {
  Query: {
    async user(_, { id }) {
      const user = await getUser(id);
      return user && user.id ? user : null;
    },
  },
  Mutation: {
    async setUserLastActiveAt(_, { id, lastActiveAt }) {
      const user = await getUser(id);
      assert(user && user.id, 'User not found');

      // Set the last active at
      user.lastActiveAt = lastActiveAt;

      await setUser(id, user);
      return true;
    },
  },
};

const schema = makeExecutableSchema({
  typeDefs: [ typeDefs, dateTimeTypeDefs ],
  resolvers: [ resolvers, dateTimeResolvers ],
});
```

Whereas this example uses [`apollo-server`](https://npm.im/apollo-server) & includes the scalar instance `DateTime` in its resolvers:

```js
const { ApolloServer } = require('apollo-server');
const { DateTime } = require('@jdrydn/graphql-datetime');

const typeDefs = /* GraphQL */`
  type User {
    id: ID!
    name: String!
    createdAt: DateTime!
    lastActiveAt: DateTime!
  }

  extend type Query {
    user: User!
  }

  extend type Mutation {
    setUserLastActiveAt(id: ID!, lastActiveAt: lastActiveAt!): Boolean!
  }

  # @NOTE You must define the scalar yourself
  scalar DateTime
`;

const resolvers = {
  Query: {
    async user(_, { id }) {
      const user = await getUser(id);
      return user && user.id ? user : null;
    },
  },
  Mutation: {
    async setUserLastActiveAt(_, { id, lastActiveAt }) {
      const user = await getUser(id);
      assert(user && user.id, 'User not found');

      // Set the last active at
      user.lastActiveAt = lastActiveAt;

      await setUser(id, user);
      return true;
    },
  },
  DateTime,
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
});
```

## Usage

Once the type definition & resolver is configured, you can send & receive Date values in GraphQL in both queries & mutations.

### Query

```graphql
query GetUser {
  user(id: "1") {
    id
    name
    lastActiveAt
  }
}
```
```json
{
  "data": {
    "user": {
      "id": "1",
      "name": "jdrydn",
      "lastActiveAt": "2022-05-01T09:00:00.000Z"
    }
  }
}
```

### Mutation

```graphql
mutation UpdateUser {
  setUserLastActiveAt(id: "1", lastActiveAt: "2022-05-01T09:00:00.000Z")
}
```
```json
{
  "data": {
    "setUserLastActiveAt": true
  }
}
```

## Notes

- Any questions or suggestions please [open an issue](https://github.com/jdrydn/graphql-scalars/issues).
