import { voiceNoMatchAdapter, voiceNoReplyAdapter } from '@realtime-sdk/adapters/creator/block/utils';
import captureV2Adapter from '@realtime-sdk/adapters/creator/block/voice/captureV2';
import { Creator } from '@test/factories';
import { BaseNode } from '@voiceflow/base-types';
import type { VoiceNode } from '@voiceflow/voice-types';

const DEFAULT_INTENT = {
  key: '',
  name: '',
  inputs: [],
  slots: [
    {
      id: 'slotID',
      dialog: {
        prompt: [{ text: 'entityPrompt', slots: [], voice: 'voice' }],
        utterances: [{ text: 'utteranceExample', slots: [] }],
        confirm: [],
        confirmEnabled: false,
      },
      required: false,
    },
  ],
};

describe('Adapters | Creator | Block | Voice | captureV2Adapter', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(() => {
    vi.resetAllMocks();
  });

  describe('when transforming from db', () => {
    it('returns correct data for default intent values', () => {
      const noReply = Creator.Block.Shared.VoiceNodeDataNoReply();
      const noMatch = Creator.Block.Shared.VoiceNodeDataNoMatch();

      vi.spyOn(voiceNoReplyAdapter, 'fromDB').mockReturnValue(noReply);
      vi.spyOn(voiceNoMatchAdapter, 'fromDB').mockReturnValue(noMatch);

      const intentCapture: VoiceNode.CaptureV2.IntentCapture<any> = {
        type: BaseNode.CaptureV2.CaptureType.INTENT as BaseNode.CaptureV2.CaptureType.INTENT,
        intent: DEFAULT_INTENT,
      };

      const data = {
        ...Creator.Block.Voice.CaptureV2StepData(),
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
      const noReply = Creator.Block.Shared.VoiceStepNoReply();
      const noMatch = Creator.Block.Shared.VoiceStepNoMatch();

      vi.spyOn(voiceNoReplyAdapter, 'toDB').mockReturnValue(noReply);
      vi.spyOn(voiceNoMatchAdapter, 'toDB').mockReturnValue(noMatch);

      const data = {
        ...Creator.Block.Voice.CaptureV2NodeData(),
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
