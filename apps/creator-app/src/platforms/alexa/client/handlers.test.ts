import { describe, expect, it } from 'vitest';

import client from '@/platforms/alexa/client/handlers';

describe('Platform Client - Alexa - Handlers', () => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).toEqual(expect.arrayContaining(['getDisplayWithDatasource']));
  });
});
