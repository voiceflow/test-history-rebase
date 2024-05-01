import { describe, expect, it } from 'vitest';

import createClient from './version';

const SERVICE_ENDPOINT = 'https://service';

const client = createClient(SERVICE_ENDPOINT);

describe('Platform Client - Utils - Version', () => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).toEqual(expect.arrayContaining(['updateSettings', 'updatePublishing']));
  });
});
