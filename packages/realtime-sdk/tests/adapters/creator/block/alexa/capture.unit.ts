import captureAdapter from '@realtime-sdk/adapters/creator/block/alexa/capture';
import { voicePromptAdapter } from '@realtime-sdk/adapters/creator/block/utils';
import { Creator } from '@test/factories';
import { expect } from 'chai';
import sinon from 'sinon';

describe('Adapters | Creator | Block | Alexa | captureAdapter', () => {
  afterEach(() => {
    sinon.reset();
    sinon.restore();
  });

  describe('when transforming from db', () => {
    it('returns correct data for default values', () => {
      const reprompt = Creator.Block.Shared.VoiceNodeDataPrompt();

      sinon.stub(voicePromptAdapter, 'fromDB').returns(reprompt);

      const data = Creator.Block.Alexa.CaptureStepData();

      const result = captureAdapter.fromDB(data);

      expect(result).eql({
        slot: data.slot,
        variable: data.variable,
        examples: data.slotInputs,
        reprompt,
        buttons: null,
      });
    });

    it('returns correct data for empty reprompt', () => {
      const voiceNoReplyAdapterSpy = sinon.stub(voicePromptAdapter, 'fromDB');

      const data = Creator.Block.Alexa.CaptureStepData({ reprompt: null });

      const result = captureAdapter.fromDB(data);

      expect(voiceNoReplyAdapterSpy.called).eql(false);
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
      const reprompt = Creator.Block.Shared.VoicePrompt();

      sinon.stub(voicePromptAdapter, 'toDB').returns(reprompt);

      const data = Creator.Block.Alexa.CaptureNodeData();

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
      const voiceNoReplySpy = sinon.stub(voicePromptAdapter, 'toDB');

      const data = Creator.Block.Alexa.CaptureNodeData({ reprompt: null });

      const result = captureAdapter.toDB(data);

      expect(voiceNoReplySpy.called).eql(false);
      expect(result).eql({
        slot: data.slot,
        variable: data.variable,
        reprompt: null,
        chips: null,
        buttons: null,
        slotInputs: data.examples,
      });
    });
  });
});
