import fetch from './fetch';

const ANALYTICS_PATH = 'analytics';

const analyticsClient = {
  trackSessionTime: (duration, skillID) => fetch.post(`${ANALYTICS_PATH}/track_session_time`, { duration, skill_id: skillID }),
};

export default analyticsClient;
