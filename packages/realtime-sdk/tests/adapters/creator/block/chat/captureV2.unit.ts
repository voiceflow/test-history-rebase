import { Creator } from '@test/factories';
import { BaseNode } from '@voiceflow/base-types';
import { ChatNode } from '@voiceflow/chat-types';
import { expect } from 'chai';
import sinon from 'sinon';

import captureV2Adapter from '@/adapters/creator/block/chat/captureV2';
import { chatNoMatchAdapter, chatNoReplyAdapter } from '@/adapters/creator/block/utils';

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
    sinon.reset();
    sinon.restore();
  });

  describe('when transforming from db', () => {
    it('returns correct data for default intent values', () => {
      const noReply = Creator.Block.Shared.ChatNodeDataNoReply();
      const noMatch = Creator.Block.Shared.ChatNodeDataNoMatch();

      sinon.stub(chatNoReplyAdapter, 'fromDB').returns(noReply);
      sinon.stub(chatNoMatchAdapter, 'fromDB').returns(noMatch);

      const intentCapture: ChatNode.CaptureV2.IntentCapture = {
        type: BaseNode.CaptureV2.CaptureType.INTENT as BaseNode.CaptureV2.CaptureType.INTENT,
        intent: DEFAULT_INTENT,
      };

      const data = {
        ...Creator.Block.Chat.CaptureV2StepData(),
        capture: intentCapture,
      };

      const result = captureV2Adapter.fromDB(data);

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

      const result = captureV2Adapter.fromDB(data);

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

      sinon.stub(chatNoReplyAdapter, 'toDB').returns(noReply);
      sinon.stub(chatNoMatchAdapter, 'toDB').returns(noMatch);

      const data = {
        ...Creator.Block.Chat.CaptureV2NodeData(),
        captureType: BaseNode.CaptureV2.CaptureType.INTENT,
        intent: { slots: DEFAULT_INTENT.slots },
      };

      const result = captureV2Adapter.toDB(data);

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

      const result = captureV2Adapter.toDB(data);

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
