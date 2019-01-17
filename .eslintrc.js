module.exports = {
  env: {
    es6: true,
    browser: true,
    node: true
  },
  extends: ["airbnb-base", "eslint:recommended", "plugin:react/recommended"],
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 6,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: [
    'import',
    'jsx-a11y',
    'react'
  ],
  rules: {
    "comma-dangle": ["error", "never"],
    "no-confusing-arrow": "off",
    "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
    "no-console": "off"
    //"react/display-name": [0]
  }
};