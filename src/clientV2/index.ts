import api from './api';
import platfromServices from './platformServices';

const client = {
  ...platfromServices,
  api,
};

export default client;
