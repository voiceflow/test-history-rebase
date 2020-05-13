const ZAPIER_PATH = 'https://hooks.zapier.com/hooks/catch/';

const zapierClient = {
  triggerZap: async (path: string, data: {}) => {
    // eslint-disable-next-line compat/compat
    await fetch(`${ZAPIER_PATH}${path}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
};

export default zapierClient;
