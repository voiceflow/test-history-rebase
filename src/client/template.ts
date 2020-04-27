import { DBTemplate } from '@/models';

import templateAdapter from './adapters/template';
import fetch from './fetch';

export const TEMPLATE_PATH = 'template';

const templateClient = {
  find: () => fetch.get<DBTemplate[]>(`${TEMPLATE_PATH}/all`).then(templateAdapter.mapFromDB),
};

export default templateClient;
