/* eslint-disable lodash/prefer-constant, @typescript-eslint/no-empty-function */

const exportGeneralService = () => ({
  run: async () => {
    throw new Error("General service can't be exported");
  },

  cancel: async () => {},

  getStatus: async () => null,

  updateStage: async () => {},
});

export default exportGeneralService;
