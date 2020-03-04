import fetch from './fetch';

const featureClient = {
  isEnabled: (featureID) => fetch(`feature/${featureID}`).then(({ status }) => status),
  find: () => fetch('features'),
};

export default featureClient;
