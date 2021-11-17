import { Creator } from '@test/factories';
import { Button } from '@voiceflow/base-types';
import { expect } from 'chai';
import sinon from 'sinon';

import captureAdapter from '@/adapters/creator/block/chat/capture';
import { chatPromptAdapter } from '@/adapters/creator/block/utils';

describe('Adapters | Creator | Block | Chat | captureAdapter', () => {
  afterEach(() => {
    sinon.reset();
    sinon.restore();
  });

  describe('when transforming from db', () => {
    it('returns correct data for default values', () => {
      const reprompt = Creator.Block.Shared.ChatPrompt();

      sinon.stub(chatPromptAdapter, 'fromDB').returns(reprompt);

      const data = Creator.Block.Chat.CaptureStepData();

      const result = captureAdapter.fromDB(data);

      expect(result).eql({
        slot: data.slot,
        buttons: data.buttons,
        variable: data.variable,
        reprompt,
        examples: data.slotInputs,
      });
    });

    it('returns correct data for empty values', () => {
      const chip = Creator.Block.Shared.ButtonChip();

      const chatNoReplyAdapterSpy = sinon.stub(chatPromptAdapter, 'fromDB');

      const data = Creator.Block.Chat.CaptureStepData({ reprompt: null, buttons: undefined, chips: [chip] });

      const result = captureAdapter.fromDB(data);

      expect(chatNoReplyAdapterSpy.called).eql(false);
      expect(result.reprompt).eql(null);
      expect(result.buttons).eql([{ name: chip.label, type: Button.ButtonType.INTENT, payload: { intentID: null } }]);
    });
  });

  describe('when transforming to db', () => {
    it('returns correct data for default values', () => {
      const reprompt = Creator.Block.Shared.ChatPrompt();

      sinon.stub(chatPromptAdapter, 'toDB').returns(reprompt);

      const data = Creator.Block.Chat.CaptureNodeData();

      const result = captureAdapter.toDB(data);

      expect(result).eql({
        slot: data.slot,
        chips: null,
        reprompt,
        buttons: data.buttons,
        variable: data.variable,
        slotInputs: data.examples,
      });
    });

    it('returns correct data for empty values', () => {
      const chatNoReplyAdapterSpy = sinon.stub(chatPromptAdapter, 'toDB');
      const data = Creator.Block.Chat.CaptureNodeData({ reprompt: null });

      const result = captureAdapter.toDB(data);

      expect(chatNoReplyAdapterSpy.called).eql(false);
      expect(result.reprompt).to.eql(null);
    });
  });
});
