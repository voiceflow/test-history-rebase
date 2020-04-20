import suite from '@/../test/_suite';
import { AUDIO_FILE_BUCKET_NAME } from '@/constants';
import { getAudioTitle } from '@/utils/audio';

suite('utils/audio', ({ expect }) => {
  describe('getAudioTitle', () => {
    it('should regex out default bucket', () => {
      const mp3 = 'test.mp3';
      const link = `${AUDIO_FILE_BUCKET_NAME}/123456789-${mp3}`;

      expect(getAudioTitle(link)).to.be.eq(mp3);
    });

    it('should not regex out external links', () => {
      const link = 'https://voiceflow.com/123456789-test-mp3';

      expect(getAudioTitle(link)).to.be.eq(link);
    });

    it('should handle nullish', () => {
      expect(getAudioTitle('')).to.be.eq('');
      expect(getAudioTitle()).to.be.eq('');
    });
  });
});
