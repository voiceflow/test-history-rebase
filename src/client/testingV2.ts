import fetch from './fetch';
import testingClient from './testing';

// TODO: collapse into @/client/testing when server refactor is rolled out
const TESTING_PATH = 'prototype'; // separate testing path for V2

const testingClientV2 = {
  ...testingClient,

  interact: (body: object, locale: string) => fetch.post<object>(`${TESTING_PATH}/interact?locale=${locale}`, body),
};

export default testingClientV2;
