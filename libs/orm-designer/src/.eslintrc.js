module.exports = {
  overrides: [
    {
      files: ['*.entity.ts'],
      rules: {
        'max-classes-per-file': 'off',
        'import/no-cycle': 'off',
      },
    },
    {
      files: ['**/migrations/*.ts'],
      rules: {
        'no-secrets/no-secrets': 'off',
      },
    },
  ],
};
