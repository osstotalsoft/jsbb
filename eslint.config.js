const js = require("@eslint/js");
const globals = require("globals");
const babelParser = require("@babel/eslint-parser");
const jest = require("eslint-plugin-jest");
const reactHooks = require("eslint-plugin-react-hooks");

module.exports = [
  { ignores: ["**/build/", "**/node_modules/"] },
  js.configs.recommended,
  jest.configs["flat/recommended"],
  {
    linterOptions: {
      reportUnusedDisableDirectives: "off"
    },
    languageOptions: {
      parser: babelParser,
      parserOptions: {
        babelOptions: { presets: ["@babel/preset-react"] }
      },
      ecmaVersion: 2018,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        Atomics: "readonly",
        SharedArrayBuffer: "readonly"
      }
    },
    plugins: {
      "react-hooks": reactHooks
    },
    rules: {
      "no-unused-vars": [2, { args: "after-used", argsIgnorePattern: "^_", caughtErrors: "none" }],
      // not part of jest/recommended when this config was written
      "jest/valid-title": "off",
      "jest/expect-expect": "off",
      "jest/no-commented-out-tests": "off"
    }
  }
];
