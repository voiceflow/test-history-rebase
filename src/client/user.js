import fetch from './fetch';

const USER_PATH = 'user';

const userClient = {
  get: () => fetch(USER_PATH),

  findProjects: (userID) => fetch(`${USER_PATH}/${userID}/projects`),

  getVendors: () => fetch('session/vendor?all=true'),
};

export default userClient;
