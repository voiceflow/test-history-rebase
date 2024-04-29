import promptAdapter from '@realtime-sdk/adapters/creator/block/alexa/prompt';
import { voiceNoMatchAdapter, voiceNoReplyAdapter } from '@realtime-sdk/adapters/creator/block/utils';
import { Creator } from '@test/factories';

describe('Adapters | Creator | Block | Alexa | promptAdapter', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(() => {
    vi.resetAllMocks();
  });

  describe('when transforming from db', () => {
    it('returns correct data for default values', () => {
      const noReply = Creator.Block.Shared.VoiceNodeDataNoReply();
      const noMatch = Creator.Block.Shared.VoiceNodeDataNoMatch();

      vi.spyOn(voiceNoReplyAdapter, 'fromDB').mockReturnValue(noReply);
      vi.spyOn(voiceNoMatchAdapter, 'fromDB').mockReturnValue(noMatch);

      const data = Creator.Block.Alexa.PromptStepData();

      const result = promptAdapter.fromDB(data, { context: {} });

      expect(result).eql({
        noReply,
        buttons: null,
        noMatch,
      });
    });

    it('returns correct data for empty values', () => {
      const noMatch = Creator.Block.Shared.VoiceNodeDataNoMatch();

      vi.spyOn(voiceNoMatchAdapter, 'fromDB').mockReturnValue(noMatch);

      const data = Creator.Block.Alexa.PromptStepData({ reprompt: null, noReply: null });

      const result = promptAdapter.fromDB(data, { context: {} });

      expect(result).eql({
        buttons: null,
        noReply: null,
        noMatch,
      });
    });
  });

  describe('when transforming to db', () => {
    it('returns correct data for default values', () => {
      const noReply = Creator.Block.Shared.VoiceStepNoReply();
      const noMatch = Creator.Block.Shared.VoiceStepNoMatch();

      vi.spyOn(voiceNoReplyAdapter, 'toDB').mockReturnValue(noReply);
      vi.spyOn(voiceNoMatchAdapter, 'toDB').mockReturnValue(noMatch);

      const data = Creator.Block.Alexa.PromptNodeData();

      const result = promptAdapter.toDB(data, { context: {} });

      expect(result).eql({
        chips: null,
        buttons: null,
        noReply,
        noMatch,
      });
    });

    it('returns correct data for empty values', () => {
      const noMatch = Creator.Block.Shared.VoiceStepNoMatch();

      vi.spyOn(voiceNoMatchAdapter, 'toDB').mockReturnValue(noMatch);

      const data = Creator.Block.Alexa.PromptNodeData({ noReply: null });

      const result = promptAdapter.toDB(data, { context: {} });

      expect(result).eql({
        chips: null,
        buttons: null,
        noReply: null,
        noMatch,
      });
    });
  });
});
