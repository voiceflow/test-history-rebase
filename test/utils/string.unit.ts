import suite from '@/../test/_suite';
import { abbreviate } from '@/utils/string';

suite('utils/string', ({ expect }) => {
  describe('abbreviate', () => {
    const maxLength = 5;

    it('under max length', () => {
      const input1 = 'holly';
      const input2 = '';
      const input3 = 'holy';

      expect(abbreviate(input1, maxLength)).to.be.eq(input1);
      expect(abbreviate(input2, maxLength)).to.be.eq(input2);
      expect(abbreviate(input3, maxLength)).to.be.eq(input3);
    });

    it('over max length', () => {
      const input1 = 'monday';
      const input2 = 'mayonnaise';

      expect(abbreviate(input1, maxLength)).to.be.eq('monda...');
      expect(abbreviate(input2, maxLength)).to.be.eq('mayon...');
    });
  });
});
