import { expect } from 'chai';
import sinon from 'sinon';

import captureAdapter from '@/adapters/creator/block/alexa/capture';
import { voiceRepromptAdapter } from '@/adapters/creator/block/utils';
import { captureNodeDataFactory, captureStepDataFactory } from '@/tests/factories/alexa/capture';
import { voicePromptNodeDataFactory, voiceTypePromptFactory } from '@/tests/factories/voice';

describe('Adapters | Creator | Block | Alexa | captureAdapter', () => {
  afterEach(() => {
    sinon.reset();
    sinon.restore();
  });

  describe('when transforming from db', () => {
    it('returns correct data for default values', () => {
      const reprompt = voicePromptNodeDataFactory();
      sinon.stub(voiceRepromptAdapter, 'fromDB').returns(reprompt);
      const data = captureStepDataFactory();

      const result = captureAdapter.fromDB(data);

      expect(result).eql({
        slot: data.slot,
        variable: data.variable,
        examples: data.slotInputs,
        reprompt,
        buttons: null,
      });
    });

    it('returns correct data for empty values', () => {
      const voiceRepromptAdapterSpy = sinon.stub(voiceRepromptAdapter, 'fromDB');
      const data = captureStepDataFactory({ reprompt: null });

      const result = captureAdapter.fromDB(data);

      expect(voiceRepromptAdapterSpy.called).eql(false);
      expect(result).eql({
        slot: data.slot,
        variable: data.variable,
        examples: data.slotInputs,
        reprompt: null,
        buttons: null,
      });
    });
  });

  describe('when transforming to db', () => {
    it('returns correct data for default values', () => {
      const reprompt = voiceTypePromptFactory();
      sinon.stub(voiceRepromptAdapter, 'toDB').returns(reprompt);
      const data = captureNodeDataFactory();

      const result = captureAdapter.toDB(data);

      expect(result).eql({
        slot: data.slot,
        variable: data.variable,
        reprompt,
        slotInputs: data.examples,
        chips: null,
        buttons: null,
      });
    });

    it('returns correct data for empty values', () => {
      const voiceRepromptAdapterSpy = sinon.stub(voiceRepromptAdapter, 'toDB');
      const data = captureNodeDataFactory({ reprompt: null });

      const result = captureAdapter.toDB(data);

      expect(voiceRepromptAdapterSpy.called).eql(false);
      expect(result).eql({
        slot: data.slot,
        variable: data.variable,
        reprompt: null,
        slotInputs: data.examples,
        chips: null,
        buttons: null,
      });
    });
  });
});
