import { BASE_COLORS } from '@ui/components/ColorPicker/constants';
import { STANDARD_GRADE } from '@ui/utils/colors/hsl';

import { normalizeColor } from '../../src/components/ColorPicker/utils';
import suite from '../_suite';

suite('color normanilzation', ({ expect }) => {
  describe('normalizeColor', () => {
    it('should normalize any kind of color to hex', () => {
      const assertions: [string | undefined, string][] = [
        ['#ffffff', '#ffffff'],
        ['#000000', '#000000'],
        ['#fff', '#fff'],
        ['#000', '#000'],
        ['rgb(255, 255, 255)', '#ffffff'],
        ['rgb(0, 0, 0)', '#000000'],
        ['rgba(255, 255, 255, .5)', '#ffffff'],
        ['rgba(0, 0, 0, .5)', '#000000'],
        [undefined, BASE_COLORS[0].palette[STANDARD_GRADE]],
      ];

      assertions.forEach(([color, hex]) => expect(normalizeColor(color)).to.equal(hex));
    });
  });
});
