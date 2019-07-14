module.exports = {
  env: {
    es6: true,
    browser: true,
    node: true
  },
  extends: ["airbnb-base", "eslint:recommended", "plugin:react/recommended"],
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 6,
    sourceType: "module",
    ecmaFeatures: {
      jsx: true
    }
  },
  plugins: ["import", "jsx-a11y", "react"],
  rules: {
    "comma-dangle": ["error", "never"],
    "no-confusing-arrow": "off",
    "import/no-extraneous-dependencies": ["error", { devDependencies: true }],
    "no-console": "off",
    "max-len": ["error", { code: 99 }],
    "linebreak-style": ["error", "windows"],
    quotes: ["warn", "double"],
    "arrow-parens": ["error", "as-needed"],
    "no-unused-expressions": [
      "error",
      { allowShortCircuit: true, allowTernary: true }
    ],
    curly: ["warn", "multi"],
    "nonblock-statement-body-position": "off",
    "implicit-arrow-linebreak": "off",
    "no-shadow": "warn",
    "operator-linebreak": [
      "error",
      "after", { overrides: { "?": "before", ":": "before" } }
    ],
    "no-nested-ternary": "off",
    "function-paren-newline": ["error", "consistent"]
    //"react/display-name": [0]
  },
  settings: {
    react: {
      version: "detect"
    }
  }
};