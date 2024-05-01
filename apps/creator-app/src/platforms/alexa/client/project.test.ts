import { describe, expect, it } from 'vitest';

import client from '@/platforms/alexa/client/project';

describe('Platform Client - Alexa - Project', () => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).toEqual(
      expect.arrayContaining(['copy', 'updateSelectedVendor', 'updateVendorSkillID'])
    );
  });
});
