import suite from '@/../test/_suite';
import { textFieldHasValue } from '@/utils/prototypeMessage';

suite('utils/prototypeMessage', () => {
  describe('textFieldHasValue', () => {
    it('should check if a string has value', () => {
      const str = 'value__';

      expect(textFieldHasValue(str)).toBe(true);
    });
    it('should check if a string is empty', () => {
      const str = '';

      expect(textFieldHasValue(str)).toBe(false);
    });
    it('should check if a SlateText has value', () => {
      const slate = [{ children: [{ text: 'lorem ipsum' }] }];

      expect(textFieldHasValue(slate)).toBe(true);
    });
    it('should check if a SlateText is empty', () => {
      const slate = [{ children: [{ text: '' }] }];

      expect(textFieldHasValue(slate)).toBe(false);
    });
  });
});
