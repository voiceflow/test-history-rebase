import fetch from './fetch';

const featureClient = {
  isEnabled: (featureID) => fetch.get(`feature/${featureID}`).then(({ status }) => status),

  find: () => fetch.get('features'),
};

export default featureClient;
