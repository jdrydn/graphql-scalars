const moduleAlias = require('module-alias');
const path = require('path');

moduleAlias.addAlias('graphql', () => {
  const { GRAPHQL_VERSION } = process.env;
  return path.resolve(__dirname, `../node_modules/graphql${GRAPHQL_VERSION || 16}`);
});
