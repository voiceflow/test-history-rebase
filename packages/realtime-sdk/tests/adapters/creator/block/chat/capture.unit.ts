import { Creator } from '@test/factories';
import { Button } from '@voiceflow/base-types';
import { expect } from 'chai';
import sinon from 'sinon';

import captureAdapter from '@/adapters/creator/block/chat/capture';
import { chatNoReplyAdapter } from '@/adapters/creator/block/utils';

describe('Adapters | Creator | Block | Chat | captureAdapter', () => {
  afterEach(() => {
    sinon.reset();
    sinon.restore();
  });

  describe('when transforming from db', () => {
    it('returns correct data for default values', () => {
      const noReply = Creator.Block.Shared.ChatNodeDataNoReply();

      sinon.stub(chatNoReplyAdapter, 'fromDB').returns(noReply);

      const data = Creator.Block.Chat.CaptureStepData();

      const result = captureAdapter.fromDB(data);

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

      const chatNoReplyAdapterSpy = sinon.stub(chatNoReplyAdapter, 'fromDB');

      const data = Creator.Block.Chat.CaptureStepData({ noReply: null, reprompt: null, buttons: undefined, chips: [chip] });

      const result = captureAdapter.fromDB(data);

      expect(chatNoReplyAdapterSpy.called).eql(false);
      expect(result.noReply).eql(null);
      expect(result.buttons).eql([{ name: chip.label, type: Button.ButtonType.INTENT, payload: { intentID: null } }]);
    });
  });

  describe('when transforming to db', () => {
    it('returns correct data for default values', () => {
      const noReply = Creator.Block.Shared.ChatStepNoReply();

      sinon.stub(chatNoReplyAdapter, 'toDB').returns(noReply);

      const data = Creator.Block.Chat.CaptureNodeData();

      const result = captureAdapter.toDB(data);

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
      const chatNoReplyAdapterSpy = sinon.stub(chatNoReplyAdapter, 'toDB');
      const data = Creator.Block.Chat.CaptureNodeData({ noReply: null });

      const result = captureAdapter.toDB(data);

      expect(chatNoReplyAdapterSpy.called).eql(false);
      expect(result.noReply).to.eql(null);
    });
  });
});
