import createJobService from '@/client/services/job';

import suite from '../../_suite';

const SERVICE_ENDPOINT = 'https://service';

const client = createJobService(SERVICE_ENDPOINT);

suite('Platform Client - Utils - createJobService', ({ expectMembers }) => {
  it('should have expected keys', () => {
    expectMembers(Object.keys(client), ['run', 'cancel', 'getStatus', 'updateStage']);
  });
});
