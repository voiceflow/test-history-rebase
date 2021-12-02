import captureAdapter from '@realtime-sdk/adapters/creator/block/alexa/capture';
import { voiceNoReplyAdapter } from '@realtime-sdk/adapters/creator/block/utils';
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
      const noReply = Creator.Block.Shared.VoiceNodeDataNoReply();

      sinon.stub(voiceNoReplyAdapter, 'fromDB').returns(noReply);

      const data = Creator.Block.Alexa.CaptureStepData();

      const result = captureAdapter.fromDB(data);

      expect(result).eql({
        slot: data.slot,
        noReply,
        buttons: null,
        variable: data.variable,
        examples: data.slotInputs,
      });
    });

    it('returns correct data for empty reprompt', () => {
      const voiceNoReplyAdapterSpy = sinon.stub(voiceNoReplyAdapter, 'fromDB');

      const data = Creator.Block.Alexa.CaptureStepData({ reprompt: null, noReply: null });

      const result = captureAdapter.fromDB(data);

      expect(voiceNoReplyAdapterSpy.called).eql(false);
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

      sinon.stub(voiceNoReplyAdapter, 'toDB').returns(noReply);

      const data = Creator.Block.Alexa.CaptureNodeData();

      const result = captureAdapter.toDB(data);

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
      const voiceNoReplySpy = sinon.stub(voiceNoReplyAdapter, 'toDB');

      const data = Creator.Block.Alexa.CaptureNodeData({ noReply: null });

      const result = captureAdapter.toDB(data);

      expect(voiceNoReplySpy.called).eql(false);
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
