module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint-config-egg/typescript',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended'
  ],
  "plugins": ["@typescript-eslint"],
  "parserOptions": {
    "project": "./tsconfig.json"
  },
  rules: {
  },
  env: {
    node: true,
  }
};
