export const REDIS_HOST = 'redis.test.e2e';

export const POSTGRES_HOST = 'postgres.test.e2e';
export const POSTGRES_DB = 'voiceflow_e2e';
export const POSTGRES_USER = 'voiceflow';

const SPEC_TEST_NAME = Cypress.spec.name.replace('/', '.');
export const TEST_EMAIL = `${SPEC_TEST_NAME}@voiceflow.com`;
export const TEST_USER = 'Test Account';
export const TEST_PASSWORD = 'th1s1smys4f3p4S$w0rd';

export const API_URL = 'https://creator-api.test.e2e:8003';
export const IDENTITY_API_URL = 'https://identity-api.test.e2e:8021/v1alpha1';

export const PLATFORM_SERVICE_URLS = {
  alexa: 'https://alexa-service.test.e2e:8001',
  general: 'https://general-service.test.e2e:8006',
};
