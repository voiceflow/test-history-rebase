import suite from '@/../test/_suite';
import { prettifyBucketURL } from '@/utils/audio';

const AUDIO_FILE_BUCKET_NAME = 'https://s3.amazonaws.com/dev-voiceflow-audio';

suite('utils/audio', () => {
  describe('prettifyBucketURL', () => {
    it('should regex out default bucket', () => {
      const mp3 = 'test.mp3';
      const link = `${AUDIO_FILE_BUCKET_NAME}/123456789-${mp3}`;

      expect(prettifyBucketURL(link)).toBe(mp3);
    });

    it('should not regex out external links', () => {
      const link = 'https://voiceflow.com/123456789-test-mp3';

      expect(prettifyBucketURL(link)).toBe(link);
    });

    it('should handle nullish', () => {
      expect(prettifyBucketURL('')).toBe('');
      expect(prettifyBucketURL()).toBe('');
    });
  });
});
