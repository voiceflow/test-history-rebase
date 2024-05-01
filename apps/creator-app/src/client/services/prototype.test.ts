import { describe, expect, it } from 'vitest';

import createClient from './prototype';

const SERVICE_ENDPOINT = 'https://service';

const client = createClient(SERVICE_ENDPOINT);

describe('Platform Client - Utils - Prototype', () => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).toEqual(expect.arrayContaining(['renderSync']));
  });
});
