import templateAdapter from './adapters/template';
import fetch from './fetch';

const TEMPLATE_PATH = 'template';

const templateClient = {
  find: () => fetch(`${TEMPLATE_PATH}/all`).then(templateAdapter.mapFromDB),
};

export default templateClient;
