import * as hsl from '@ui/utils/colors/hsl';

import suite from '../_suite';

const { createShadesFromHue, HUE_MAX, HUE_MIN } = hsl;

/*
  The mock below locks the saturation level to 65 so as to keep the HEX shades consistent
  and test our module in isolation, even if the default saturation level form our hsl module
  would be changed in the future by request from the Design team.
*/

Object.defineProperty(hsl, 'SATURATION', { value: 65 });

suite('hsl', ({ expect }) => {
  describe('createShadesFromHue', () => {
    it('should generate ten hsl color shades for a given hue value', () => {
      const assertions: [string, Record<string, string>][] = [
        [
          '1',
          {
            50: `#f9eaed`,
            100: `#f5dce0`,
            200: `#f1cbd1`,
            300: `#edb9c2`,
            400: `#e89ca9`,
            500: `#e37c91`,
            600: `#de5275`,
            700: `#b33e5c`,
            800: `#842c42`,
            900: `#551928`,
          },
        ],
        [
          '150',
          {
            50: `#c6f9df`,
            100: `#94f6c8`,
            200: `#81e8b9`,
            300: `#78d9ad`,
            400: `#6ac199`,
            500: `#5daa87`,
            600: `#4e9072`,
            700: `#3d725a`,
            800: `#2a5340`,
            900: `#183327`,
          },
        ],
      ];

      assertions.forEach(([hue, hsl]) => expect(createShadesFromHue(hue)).to.deep.equal(hsl));
    });

    it(`should cap hue values to min ${HUE_MIN} and max ${HUE_MAX}`, () => {
      const assertions: [string, Record<string, string>][] = [
        [
          `${Number(HUE_MIN) - 10}`,
          {
            50: `#f9eaed`,
            100: `#f5dce0`,
            200: `#f1cbd1`,
            300: `#edb9c2`,
            400: `#e89ca9`,
            500: `#e37c91`,
            600: `#de5275`,
            700: `#b33e5c`,
            800: `#842c42`,
            900: `#551928`,
          },
        ],
        [
          `${Number(HUE_MAX) + 10}`,
          {
            50: `#f9eaed`,
            100: `#f5dce1`,
            200: `#f1cbd1`,
            300: `#edb9c2`,
            400: `#e79cab`,
            500: `#e37c93`,
            600: `#de5277`,
            700: `#b33e5e`,
            800: `#842c43`,
            900: `#541929`,
          },
        ],
      ];

      assertions.forEach(([hue, hsl]) => expect(createShadesFromHue(hue)).to.deep.equal(hsl));
    });
  });
});
