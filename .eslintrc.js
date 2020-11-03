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
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": 1,
    "no-unused-expressions": "off",
    "@typescript-eslint/no-unused-expressions": 0,
    "prefer-optional-chain": "off",
    "@typescript-eslint/prefer-optional-chain": 1,
    "no-extra-semi": "off",
    "@typescript-eslint/no-extra-semi": 1,
    "comma-dangle": "off",
    "@typescript-eslint/comma-dangle": 1
  },
  env: {
    node: true,
  }
};
