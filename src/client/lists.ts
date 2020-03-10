import { ProjectList } from '@/models';

import fetch from './fetch';

const LISTS_PATH = 'team';

const listClient = {
  update: (teamID: string, data: { boards: ProjectList[] }) => fetch.patch(`${LISTS_PATH}/${teamID}/update_board`, data),
};

export default listClient;
