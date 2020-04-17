import fetch from './fetch';

const ANALYTICS_PATH = 'analytics';

const analyticsClient = {
  track: <P extends {}, K extends keyof P>(
    event: string,
    { hashed, teamhashed, properties = {} as P }: { hashed?: K[]; teamhashed?: K[]; properties?: P } = {}
  ) => {
    fetch.post(`${ANALYTICS_PATH}/track`, {
      event,
      hashed,
      teamhashed,
      properties,
    });
  },

  identify: (traits: {}) => {
    fetch.post(`${ANALYTICS_PATH}/identify`, { traits });
  },
};

export default analyticsClient;
