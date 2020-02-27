import fetch from './fetch';

const onboardingClient = {
  submit: (survey) => fetch.post('onboard', survey),
};

export default onboardingClient;
