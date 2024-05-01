import { describe, expect, it } from 'vitest';

import client from '@/platforms/alexa/client';

describe('Platform Client - Alexa', () => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).toEqual(
      expect.arrayContaining([
        'export',
        'modelExport',
        'modelImport',
        'project',
        'publish',
        'session',
        'version',
        'prototype',
        'handlers',
      ])
    );
  });
});
