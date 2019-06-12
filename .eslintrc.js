module.exports = {
  extends: '@voiceflow/eslint-config/frontend',
  rules: {
    'no-param-reassign': ['error', { props: false }],

    // disabled temporarily by setting as warnings
    'max-len': 'warn',
    camelcase: 'warn',
    'react/prop-types': 'warn',
    'import/no-unresolved': 'warn',
    'react/jsx-curly-brace-presence': 'warn',
    'react/destructuring-assignment': 'warn',
    'filenames/match-regex': 'warn',
    'filenames/match-exported': 'warn',
    'optimize-regex/optimize-regex': 'warn',
    'lodash/prefer-lodash-typecheck': 'warn',
    'simple-import-sort/sort': 'warn',
    'consistent-return': 'warn',
    'sonarjs/no-duplicated-branches': 'warn',
    'sonarjs/cognitive-complexity': 'warn',
    'react/jsx-filename-extension': 'warn',
    'lodash/import-scope': 'warn',
    'import/prefer-default-export': 'warn',
    'require-jsdoc': 'warn',
    'no-process-env': 'warn',
    'no-shadow': 'warn',
    'max-depth': 'warn',
  },
};
