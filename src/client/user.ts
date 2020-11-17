import { Account } from '@/models';

import fetch from './fetch';

const USER_PATH = 'user';

const userClient = {
  get: () => fetch.get<Account>(USER_PATH),

  updateProfilePicture: (url: string) => fetch.post('user/profilePictureURL', { url }),
};

export default userClient;
