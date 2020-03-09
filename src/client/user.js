import fetch from './fetch';

const USER_PATH = 'user';

const userClient = {
  get: () => fetch.get(USER_PATH),

  findProjects: (userID) => fetch.get(`${USER_PATH}/${userID}/projects`),

  getVendors: () => fetch.get('session/vendor?all=true'),
};

export default userClient;
