import * as hsl from '@ui/utils/colors/hsl';

import suite from '../_suite';

const { createHEXShadesFromHSL, HUE_MAX, HUE_MIN } = hsl;

/*
  The mock below locks the saturation level to 65 so as to keep the HEX shades consistent
  and test our module in isolation, even if the default saturation level form our hsl module
  would be changed in the future by request from the Design team.
*/

Object.defineProperty(hsl, 'SATURATION', { value: 65 });

suite('hsl', ({ expect }) => {
  describe('createHEXShadesFromHSL', () => {
    it('should generate ten hsl color shades for a given hue value', () => {
      const assertions: [string, Record<string, string>][] = [
        [
          '0',
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

      assertions.forEach(([hue, hsl]) => expect(createHEXShadesFromHSL(hue)).to.deep.equal(hsl));
    });

    it(`should cap hue values to min ${HUE_MIN} and max ${HUE_MAX}`, () => {
      const assertions: [string, Record<string, string>][] = [
        [
          `${Number(HUE_MIN) - 10}`,
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

      assertions.forEach(([hue, hsl]) => expect(createHEXShadesFromHSL(hue)).to.deep.equal(hsl));
    });
  });
});
