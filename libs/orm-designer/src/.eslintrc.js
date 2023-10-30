module.exports = {
  overrides: [
    {
      files: ['*.ts'],
      rules: {
        'import/no-cycle': 'off',
      },
    },
    {
      files: ['*.entity.ts'],
      rules: {
        'max-classes-per-file': 'off',
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
