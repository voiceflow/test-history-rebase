import axios from 'axios';

import { ALEXA_SERVICE_ENDPOINT } from '@/config';

const RESOURCE_ENDPOINT = 'handlers';

const handlersAlexaService = {
  getDisplayWithDatasource: (title: string, imageURL: string) =>
    axios
      .post<void>(`${ALEXA_SERVICE_ENDPOINT}/${RESOURCE_ENDPOINT}/display/with-datasource`, { title, imageURL })
      .then((res) => res.data),
};

export default handlersAlexaService;
