export const POSTGRES_HOST = '127.0.0.1';
export const POSTGRES_DB = Cypress.env('CI') ? 'voiceflow_e2e' : 'voiceflow_local';
export const POSTGRES_USER = 'voiceflow';

export const TEST_EMAIL = 'automated.test@voiceflow.com';
export const TEST_USER = 'Test Account';
export const TEST_PASSWORD = 'th1s1smys4f3p4ssw0rd';
