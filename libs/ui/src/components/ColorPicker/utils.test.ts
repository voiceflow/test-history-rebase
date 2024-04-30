import { describe, expect, it } from 'vitest';

import { normalizeColor } from './utils';

describe('color normanilzation', () => {
  describe('normalizeColor', () => {
    it('should normalize any kind of color to hex', () => {
      const assertions: [string, string][] = [
        ['#ffffff', '#ffffff'],
        ['#000000', '#000000'],
        ['#fff', '#fff'],
        ['#000', '#000'],
        ['rgb(255, 255, 255)', '#ffffff'],
        ['rgb(0, 0, 0)', '#000000'],
        ['rgba(255, 255, 255, .5)', '#ffffff'],
        ['rgba(0, 0, 0, .5)', '#000000'],
      ];

      assertions.forEach(([color, hex]) => expect(normalizeColor(color)).toEqual(hex));
    });
  });
});
