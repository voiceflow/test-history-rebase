import captureV2Adapter from '@realtime-sdk/adapters/creator/block/chat/captureV2';
import { chatNoMatchAdapter, chatNoReplyAdapter } from '@realtime-sdk/adapters/creator/block/utils';
import { Creator } from '@test/factories';
import { BaseNode } from '@voiceflow/base-types';
import type { ChatNode } from '@voiceflow/chat-types';

const DEFAULT_INTENT = {
  key: '',
  name: '',
  inputs: [],
  slots: [
    {
      id: 'slotID',
      dialog: {
        prompt: [{ id: '', content: [{ text: 'promptContent' }] }],
        utterances: [{ text: 'utteranceExample', slots: [] }],
        confirm: [],
        confirmEnabled: false,
      },
      required: false,
    },
  ],
};

describe('Adapters | Creator | Block | Chat | captureV2Adapter', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(() => {
    vi.resetAllMocks();
  });

  describe('when transforming from db', () => {
    it('returns correct data for default intent values', () => {
      const noReply = Creator.Block.Shared.ChatNodeDataNoReply();
      const noMatch = Creator.Block.Shared.ChatNodeDataNoMatch();

      vi.spyOn(chatNoReplyAdapter, 'fromDB').mockReturnValue(noReply);
      vi.spyOn(chatNoMatchAdapter, 'fromDB').mockReturnValue(noMatch);

      const intentCapture: ChatNode.CaptureV2.IntentCapture = {
        type: BaseNode.CaptureV2.CaptureType.INTENT as BaseNode.CaptureV2.CaptureType.INTENT,
        intent: DEFAULT_INTENT,
      };

      const data = {
        ...Creator.Block.Chat.CaptureV2StepData(),
        capture: intentCapture,
      };

      const result = captureV2Adapter.fromDB(data, { context: {} });

      expect(result).eql({
        captureType: BaseNode.CaptureV2.CaptureType.INTENT,
        intent: { slots: DEFAULT_INTENT.slots },
        variable: null,
        noReply,
        noMatch,
        intentScope: undefined,
      });
    });

    it('returns correct data for default query values', () => {
      const queryCapture: BaseNode.CaptureV2.QueryCapture = {
        type: BaseNode.CaptureV2.CaptureType.QUERY,
        variable: 'variableName',
      };

      const data = {
        capture: queryCapture,
        noReply: null,
        noMatch: null,
      };

      const result = captureV2Adapter.fromDB(data, { context: {} });

      expect(result).eql({
        captureType: BaseNode.CaptureV2.CaptureType.QUERY,
        intent: undefined,
        variable: queryCapture.variable,
        noReply: null,
        noMatch: null,
        intentScope: undefined,
      });
    });
  });

  describe('when transforming to db', () => {
    it('returns correct data for default values', () => {
      const noReply = Creator.Block.Shared.ChatStepNoReply();
      const noMatch = Creator.Block.Shared.ChatStepNoMatch();

      vi.spyOn(chatNoReplyAdapter, 'toDB').mockReturnValue(noReply);
      vi.spyOn(chatNoMatchAdapter, 'toDB').mockReturnValue(noMatch);

      const data = {
        ...Creator.Block.Chat.CaptureV2NodeData(),
        captureType: BaseNode.CaptureV2.CaptureType.INTENT,
        intent: { slots: DEFAULT_INTENT.slots },
      };

      const result = captureV2Adapter.toDB(data, { context: {} });

      expect(result).eql({
        capture: {
          type: BaseNode.CaptureV2.CaptureType.INTENT,
          intent: DEFAULT_INTENT,
        },
        noReply,
        noMatch,
        intentScope: undefined,
      });
    });

    it('returns correct data for default query values', () => {
      const data = {
        captureType: BaseNode.CaptureV2.CaptureType.QUERY,
        variable: 'variableName',
        noReply: null,
        noMatch: null,
      };

      const result = captureV2Adapter.toDB(data, { context: {} });

      expect(result).eql({
        capture: {
          type: BaseNode.CaptureV2.CaptureType.QUERY,
          variable: 'variableName',
        },
        noReply: null,
        noMatch: null,
        intentScope: undefined,
      });
    });
  });
});
