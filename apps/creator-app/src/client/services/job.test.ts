import { describe, expect, it } from 'vitest';

import createJobService from './job';

const SERVICE_ENDPOINT = 'https://service';

const client = createJobService(SERVICE_ENDPOINT);

describe('Platform Client - Utils - createJobService', () => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).toEqual(expect.arrayContaining(['run', 'cancel', 'getStatus', 'updateStage']));
  });
});
