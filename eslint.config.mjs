import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'

const eslintConfig = [
  ...nextCoreWebVitals,
  {
    // React Compiler is not enabled in this project — disable its lint rules
    rules: {
      'react-compiler/react-compiler': 'off',
    },
  },
  {
    // New rules introduced in eslint-plugin-react-hooks@5 (via eslint-config-next@16).
    // These flag pre-existing code patterns that were valid under v4.
    // Disable until code is updated to conform.
    rules: {
      'react-hooks/set-state-in-effect': 'off',
      'react-hooks/refs': 'off',
      'react-hooks/immutability': 'off',
      'react-hooks/preserve-manual-memoization': 'off',
    },
  },
  {
    ignores: ['build/**', 'dist/**', '**/*.d.ts'],
  },
  {
    rules: {
      eqeqeq: 'error',
      'no-empty': 'error',
      'max-params': ['error', { max: 4 }],
      'max-depth': ['warn', 2],
      'no-param-reassign': 'error',
      'no-useless-return': 'error',
      'no-warning-comments': 'warn',
      'no-console': 'warn',
      'object-curly-spacing': ['error', 'always'],
      'comma-spacing': ['error', { before: false, after: true }],
      'comma-dangle': ['error', 'always-multiline'],
      'no-multiple-empty-lines': ['error', { max: 1 }],
      'no-trailing-spaces': 'error',
      radix: 'error',
      'require-await': 'error',
      'require-jsdoc': 'off',
      semi: ['error', 'never'],
      'newline-before-return': 'error',
      'lines-between-class-members': ['error', 'always'],
      'no-duplicate-imports': 'error',
    },
  },
  {
    files: ['**/*.test.{ts,tsx}'],
    rules: {
      complexity: 'off',
      'max-nested-callbacks': 'off',
      'max-depth': 'off',
      'max-params': 'off',
      'max-lines': 'off',
      'max-lines-per-function': 'off',
    },
  },
]

export default eslintConfig
