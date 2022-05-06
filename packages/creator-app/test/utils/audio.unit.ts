import suite from '@/../test/_suite';
import { prettifyBucketURL } from '@/utils/audio';

const AUDIO_FILE_BUCKET_NAME = 'https://s3.amazonaws.com/com.getstoryflow.audio.sandbox';

suite('utils/audio', ({ expect }) => {
  describe('prettifyBucketURL', () => {
    it('should regex out default bucket', () => {
      const mp3 = 'test.mp3';
      const link = `${AUDIO_FILE_BUCKET_NAME}/123456789-${mp3}`;

      expect(prettifyBucketURL(link)).to.be.eq(mp3);
    });

    it('should not regex out external links', () => {
      const link = 'https://voiceflow.com/123456789-test-mp3';

      expect(prettifyBucketURL(link)).to.be.eq(link);
    });

    it('should handle nullish', () => {
      expect(prettifyBucketURL('')).to.be.eq('');
      expect(prettifyBucketURL()).to.be.eq('');
    });
  });
});
