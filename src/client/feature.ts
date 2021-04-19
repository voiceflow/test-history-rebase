import queryString from 'query-string';

import fetch from './fetch';

const featureClient = {
  getStatuses: (context: { workspaceID?: string } = {}) =>
    fetch.get<Record<string, { isEnabled: boolean }>>(
      queryString.stringifyUrl({ url: 'features/status', query: context }, { skipEmptyString: true })
    ),
};

export default featureClient;
