import fetch from './fetch';
import testingClient, { TESTING_PATH } from './testing';

// TODO: collapse into @/client/testing when server refactor is rolled out
const testingClientV2 = {
  ...testingClient,

  interact: (body: object, locale: string) => fetch.post<object>(`${TESTING_PATH}/interact?locale=${locale}`, body),
};

export default testingClientV2;
