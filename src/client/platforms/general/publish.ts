const publishGeneralService = () => ({
  run: async () => {
    throw new Error("General service can't be published");
  },

  cancel: async () => {},

  getStatus: async () => null,

  updateStage: async () => {},
});

export default publishGeneralService;
