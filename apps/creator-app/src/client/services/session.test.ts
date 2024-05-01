import { describe, expect, it } from 'vitest';

import createClient from './session';

const SERVICE_ENDPOINT = 'https://service';

const client = createClient(SERVICE_ENDPOINT);

describe('Platform Client - Utils - Session', () => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).toEqual(expect.arrayContaining(['getAccount', 'linkAccount', 'unlinkAccount']));
  });
});
