import { describe, expect, it } from 'vitest';

import * as hsl from './hsl';

const { createShadesFromHue, HUE_MAX, HUE_MIN } = hsl;

describe('hsl', () => {
  describe('createShadesFromHue', () => {
    it('should generate ten hsl color shades for a given hue value', () => {
      const assertions: [string, Record<string, string>][] = [
        [
          '1',
          {
            50: '#f7ebed',
            100: '#f1dee1',
            200: '#ebcdd2',
            300: '#e5bcc3',
            400: '#dca1ab',
            500: '#d58493',
            600: '#ce6179',
            700: '#a64a5f',
            800: '#7a3544',
            900: '#4e1f29',
          },
        ],
        [
          '150',
          {
            50: '#d0f7e2',
            100: '#aaf2ce',
            200: '#99e4bf',
            300: '#8ed5b3',
            400: '#7ebe9f',
            500: '#6fa78b',
            600: '#5d8e76',
            700: '#49705d',
            800: '#345143',
            900: '#1e3229',
          },
        ],
      ];

      assertions.forEach(([hue, hsl]) => expect(createShadesFromHue(hue)).toEqual(hsl));
    });

    it(`should cap hue values to min ${HUE_MIN} and max ${HUE_MAX}`, () => {
      const assertions: [string, Record<string, string>][] = [
        [
          `${Number(HUE_MIN) - 10}`,
          {
            50: '#f7ebed',
            100: '#f1dee1',
            200: '#ebcdd2',
            300: '#e5bcc3',
            400: '#dca1ab',
            500: '#d58493',
            600: '#ce6179',
            700: '#a64a5f',
            800: '#7a3544',
            900: '#4e1f29',
          },
        ],
        [
          `${Number(HUE_MAX) + 10}`,
          {
            50: '#f7ebed',
            100: '#f1dee1',
            200: '#ebcdd2',
            300: '#e5bcc3',
            400: '#dca1ac',
            500: '#d58495',
            600: '#ce607a',
            700: '#a54a60',
            800: '#7a3545',
            900: '#4d1f2a',
          },
        ],
      ];

      assertions.forEach(([hue, hsl]) => expect(createShadesFromHue(hue)).toEqual(hsl));
    });
  });
});
