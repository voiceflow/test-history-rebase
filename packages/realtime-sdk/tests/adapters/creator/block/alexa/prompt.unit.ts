import promptAdapter from '@realtime-sdk/adapters/creator/block/alexa/prompt';
import { voiceNoMatchAdapter, voiceNoReplyAdapter } from '@realtime-sdk/adapters/creator/block/utils';
import { Creator } from '@test/factories';
import { expect } from 'chai';
import Sinon from 'sinon';

describe('Adapters | Creator | Block | Alexa | promptAdapter', () => {
  afterEach(() => {
    Sinon.reset();
    Sinon.restore();
  });

  describe('when transforming from db', () => {
    it('returns correct data for default values', () => {
      const noReply = Creator.Block.Shared.VoiceNodeDataNoReply();
      const noMatch = Creator.Block.Shared.VoiceNodeDataNoMatch();

      Sinon.stub(voiceNoReplyAdapter, 'fromDB').returns(noReply);
      Sinon.stub(voiceNoMatchAdapter, 'fromDB').returns(noMatch);

      const data = Creator.Block.Alexa.PromptStepData();

      const result = promptAdapter.fromDB(data);

      expect(result).eql({
        noReply,
        buttons: null,
        noMatch,
      });
    });

    it('returns correct data for empty values', () => {
      const noMatch = Creator.Block.Shared.VoiceNodeDataNoMatch();

      Sinon.stub(voiceNoMatchAdapter, 'fromDB').returns(noMatch);

      const data = Creator.Block.Alexa.PromptStepData({ reprompt: null, noReply: null });

      const result = promptAdapter.fromDB(data);

      expect(result).eql({
        buttons: null,
        noReply: null,
        noMatch,
      });
    });
  });

  describe('when transforming to db', () => {
    it('returns correct data for default values', () => {
      const noReply = Creator.Block.Shared.VoiceStepNoReply();
      const noMatch = Creator.Block.Shared.VoiceStepNoMatch();

      Sinon.stub(voiceNoReplyAdapter, 'toDB').returns(noReply);
      Sinon.stub(voiceNoMatchAdapter, 'toDB').returns(noMatch);

      const data = Creator.Block.Alexa.PromptNodeData();

      const result = promptAdapter.toDB(data);

      expect(result).eql({
        chips: null,
        buttons: null,
        noReply,
        noMatch,
      });
    });

    it('returns correct data for empty values', () => {
      const noMatch = Creator.Block.Shared.VoiceStepNoMatch();

      Sinon.stub(voiceNoMatchAdapter, 'toDB').returns(noMatch);

      const data = Creator.Block.Alexa.PromptNodeData({ noReply: null });

      const result = promptAdapter.toDB(data);

      expect(result).eql({
        chips: null,
        buttons: null,
        noReply: null,
        noMatch,
      });
    });
  });
});
