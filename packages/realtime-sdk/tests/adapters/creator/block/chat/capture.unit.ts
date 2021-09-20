import { Button } from '@voiceflow/base-types';
import { expect } from 'chai';
import sinon from 'sinon';

import captureAdapter from '@/adapters/creator/block/chat/capture';
import { chatRepromptAdapter } from '@/adapters/utils';
import { captureNodeDataFactory, captureStepDataFactory, chipFactory, promptChatTypeFactory } from '@/tests/factories/chat/capture';

describe('Adapters | Creator | Block | Chat | captureAdapter', () => {
  afterEach(() => {
    sinon.reset();
    sinon.restore();
  });

  describe('when transforming from db', () => {
    it('returns correct data for default values', () => {
      const reprompt = promptChatTypeFactory();
      sinon.stub(chatRepromptAdapter, 'fromDB').returns(reprompt);
      const data = captureStepDataFactory();

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
      const chip = chipFactory();
      const chatRepromptAdapterSpy = sinon.stub(chatRepromptAdapter, 'fromDB');
      const data = captureStepDataFactory({ reprompt: null, buttons: undefined, chips: [chip] });

      const result = captureAdapter.fromDB(data);

      expect(chatRepromptAdapterSpy.called).eql(false);
      expect(result.reprompt).eql(null);
      expect(result.buttons).eql([{ name: chip.label, type: Button.ButtonType.INTENT, payload: { intentID: null } }]);
    });
  });

  describe('when transforming to db', () => {
    it('returns correct data for default values', () => {
      const reprompt = promptChatTypeFactory();
      sinon.stub(chatRepromptAdapter, 'toDB').returns(reprompt);
      const data = captureNodeDataFactory();

      const result = captureAdapter.toDB(data);

      expect(result).eql({
        slot: data.slot,
        chips: null,
        buttons: data.buttons,
        variable: data.variable,
        slotInputs: data.examples,
        reprompt,
      });
    });

    it('returns correct data for empty values', () => {
      const chatRepromptAdapterSpy = sinon.stub(chatRepromptAdapter, 'toDB');
      const data = captureNodeDataFactory({ reprompt: null });

      const result = captureAdapter.toDB(data);

      expect(chatRepromptAdapterSpy.called).eql(false);
      expect(result.reprompt).to.eql(null);
    });
  });
});
