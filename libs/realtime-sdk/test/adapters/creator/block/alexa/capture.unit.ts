import captureAdapter from '@realtime-sdk/adapters/creator/block/alexa/capture';
import { voiceNoReplyAdapter } from '@realtime-sdk/adapters/creator/block/utils';
import { Creator } from '@test/factories';

describe('Adapters | Creator | Block | Alexa | captureAdapter', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(() => {
    vi.resetAllMocks();
  });

  describe('when transforming from db', () => {
    it('returns correct data for default values', () => {
      const noReply = Creator.Block.Shared.VoiceNodeDataNoReply();

      vi.spyOn(voiceNoReplyAdapter, 'fromDB').mockReturnValue(noReply);

      const data = Creator.Block.Alexa.CaptureStepData();

      const result = captureAdapter.fromDB(data, { context: {} });

      expect(result).eql({
        slot: data.slot,
        noReply,
        buttons: null,
        variable: data.variable,
        examples: data.slotInputs,
      });
    });

    it('returns correct data for empty reprompt', () => {
      const voiceNoReplyAdapterSpy = vi.spyOn(voiceNoReplyAdapter, 'fromDB');

      const data = Creator.Block.Alexa.CaptureStepData({ reprompt: null, noReply: null });

      const result = captureAdapter.fromDB(data, { context: {} });

      expect(voiceNoReplyAdapterSpy).not.toBeCalled();
      expect(result).eql({
        slot: data.slot,
        noReply: null,
        buttons: null,
        variable: data.variable,
        examples: data.slotInputs,
      });
    });
  });

  describe('when transforming to db', () => {
    it('returns correct data for default values', () => {
      const noReply = Creator.Block.Shared.VoiceStepNoReply();

      vi.spyOn(voiceNoReplyAdapter, 'toDB').mockReturnValue(noReply);

      const data = Creator.Block.Alexa.CaptureNodeData();

      const result = captureAdapter.toDB(data, { context: {} });

      expect(result).eql({
        slot: data.slot,
        chips: null,
        buttons: null,
        noReply,
        variable: data.variable,
        slotInputs: data.examples,
      });
    });

    it('returns correct data for empty values', () => {
      const voiceNoReplySpy = vi.spyOn(voiceNoReplyAdapter, 'toDB');

      const data = Creator.Block.Alexa.CaptureNodeData({ noReply: null });

      const result = captureAdapter.toDB(data, { context: {} });

      expect(voiceNoReplySpy).not.toBeCalled();
      expect(result).eql({
        slot: data.slot,
        chips: null,
        buttons: null,
        noReply: null,
        variable: data.variable,
        slotInputs: data.examples,
      });
    });
  });
});
