import { describe, expect, it } from 'vitest';

import client from '@/platforms/general/client/project';

describe('Platform Client - General - Project', () => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).toEqual(expect.arrayContaining(['copy']));
  });
});
