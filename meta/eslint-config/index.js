/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: ['@voiceflow/eslint-config'],
  ignorePatterns: ['build/**/*'],
  overrides: [
    {
      files: ['**/*.test.ts', 'test/**/*.ts'],
      rules: {
        // Strings may end up being duplicated in test files
        'sonarjs/no-duplicate-string': 'warn',
      },
    },
    {
      files: ['*.tsx'],
      extends: ['@voiceflow/eslint-config/frontend'],
      rules: {
        'react/react-in-jsx-scope': 'off',
        'jsx-a11y/no-autofocus': 'off',
      },
    },
    {
      files: ['*.ts', '*.tsx'],
      extends: ['@voiceflow/eslint-config/typescript'],
      rules: {
        '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '^_', argsIgnorePattern: '^_' }],
        '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
        '@typescript-eslint/no-unnecessary-type-constraint': 'off',
        '@typescript-eslint/lines-between-class-members': ['error', 'always', { exceptAfterOverload: true }],
        'lines-between-class-members': 'off',
        // common pattern when writing styled components
        'sonarjs/no-nested-template-literals': 'off',
        'no-restricted-syntax': ['error', { selector: 'TSEnumDeclaration', message: 'TS enums are not allowed, use enum-like objects instead.' }],
      },
    },
  ],
  rules: {
    'no-restricted-syntax': 'off',
    'import/extensions': 'off',
    'import/no-extraneous-dependencies': 'off',
    // 'prettier/prettier': ['error', {}, { usePrettierrc: true }],
    'prettier/prettier': 'off',
  },
};
