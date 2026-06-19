// ESLint flat config (ESLint 9+)
const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const prettierConfig = require('eslint-config-prettier');

// Globals shared across the (small) JS/TS sources and the CommonJS config files.
const sharedGlobals = {
  console: 'readonly',
  process: 'readonly',
  module: 'writable',
  require: 'readonly',
  exports: 'writable',
  __dirname: 'readonly',
};

module.exports = tseslint.config(
  {
    ignores: ['node_modules/**', 'dist/**', 'coverage/**'],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettierConfig,
  {
    files: ['**/*.ts', '**/*.js'],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: sharedGlobals,
    },
    rules: {
      // Scaffold code carries placeholder/API signatures with not-yet-used args.
      '@typescript-eslint/no-unused-vars': ['error', { args: 'none' }],
    },
  },
  {
    // CommonJS tooling/config files legitimately use require().
    files: ['**/*.config.js'],
    languageOptions: {
      sourceType: 'commonjs',
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
);
