import { describe, expect, it } from 'vitest';

import fetch from '../fetch';
import createClient from './modelExport';

const client = createClient(fetch);

describe('Platform Client - Utils - ModelExport', () => {
  it('should have expected keys', () => {
    expect(Object.keys(client)).toEqual(expect.arrayContaining(['exportBlob']));
  });
});
