import captureAdapter from '@realtime-sdk/adapters/creator/block/chat/capture';
import { chatNoReplyAdapter } from '@realtime-sdk/adapters/creator/block/utils';
import { Creator } from '@test/factories';
import { BaseButton } from '@voiceflow/base-types';

describe('Adapters | Creator | Block | Chat | captureAdapter', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(() => {
    vi.resetAllMocks();
  });

  describe('when transforming from db', () => {
    it('returns correct data for default values', () => {
      const noReply = Creator.Block.Shared.ChatNodeDataNoReply();

      vi.spyOn(chatNoReplyAdapter, 'fromDB').mockReturnValue(noReply);

      const data = Creator.Block.Chat.CaptureStepData();

      const result = captureAdapter.fromDB(data, { context: {} });

      expect(result).eql({
        slot: data.slot,
        noReply,
        buttons: data.buttons,
        variable: data.variable,
        examples: data.slotInputs,
      });
    });

    it('returns correct data for empty values', () => {
      const chip = Creator.Block.Shared.ButtonChip();

      const chatNoReplyAdapterSpy = vi.spyOn(chatNoReplyAdapter, 'fromDB');

      const data = Creator.Block.Chat.CaptureStepData({ noReply: null, reprompt: null, buttons: undefined, chips: [chip] });

      const result = captureAdapter.fromDB(data, { context: {} });

      expect(chatNoReplyAdapterSpy).not.toBeCalled();
      expect(result.noReply).eql(null);
      expect(result.buttons).eql([{ name: chip.label, type: BaseButton.ButtonType.INTENT, payload: { intentID: null } }]);
    });
  });

  describe('when transforming to db', () => {
    it('returns correct data for default values', () => {
      const noReply = Creator.Block.Shared.ChatStepNoReply();

      vi.spyOn(chatNoReplyAdapter, 'toDB').mockReturnValue(noReply);

      const data = Creator.Block.Chat.CaptureNodeData();

      const result = captureAdapter.toDB(data, { context: {} });

      expect(result).eql({
        slot: data.slot,
        chips: null,
        noReply,
        buttons: data.buttons,
        variable: data.variable,
        slotInputs: data.examples,
      });
    });

    it('returns correct data for empty values', () => {
      const chatNoReplyAdapterSpy = vi.spyOn(chatNoReplyAdapter, 'toDB');
      const data = Creator.Block.Chat.CaptureNodeData({ noReply: null });

      const result = captureAdapter.toDB(data, { context: {} });

      expect(chatNoReplyAdapterSpy).not.toBeCalled();
      expect(result.noReply).to.eql(null);
    });
  });
});
