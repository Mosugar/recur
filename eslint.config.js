// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');
const eslintPluginPrettierRecommended = require('eslint-plugin-prettier/recommended');

module.exports = defineConfig([
  expoConfig,
  eslintPluginPrettierRecommended,
  {
    rules: {
      'prettier/prettier': [
        'error',
        {
          semi: true,
          singleQuote: false,
          trailingComma: 'all',
          printWidth: 100,
          tabWidth: 2,
          bracketSameLine: false,
        },
      ],
    },
  },
  {
    ignores: ['dist/*', 'example/*', '.expo/*'],
  },
]);
