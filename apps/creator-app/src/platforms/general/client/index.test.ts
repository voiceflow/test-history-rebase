import { describe, expect, it } from 'vitest';

import client from '@/platforms/general/client';

describe('Platform Client - General', () => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).toEqual(
      expect.arrayContaining([
        'export',
        'modelExport',
        'modelImport',
        'project',
        'publish',
        'version',
        'prototype',
        'tts',
      ])
    );
  });
});
