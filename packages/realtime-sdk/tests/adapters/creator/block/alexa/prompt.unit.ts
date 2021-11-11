import { expect } from 'chai';
import Sinon from 'sinon';

import promptAdapter from '@/adapters/creator/block/alexa/prompt';
import { voiceNoMatchAdapter, voicePromptAdapter } from '@/adapters/creator/block/utils';
import { Creator } from '@/tests/factories';

describe('Adapters | Creator | Block | Alexa | promptAdapter', () => {
  afterEach(() => {
    Sinon.reset();
    Sinon.restore();
  });

  describe('when transforming from db', () => {
    it('returns correct data for default values', () => {
      const reprompt = Creator.Block.Shared.VoiceNodeDataPrompt();
      const noMatches = Creator.Block.Shared.VoiceNodeDataNoMatch();

      Sinon.stub(voicePromptAdapter, 'fromDB').returns(reprompt);
      Sinon.stub(voiceNoMatchAdapter, 'fromDB').returns(noMatches);

      const data = Creator.Block.Alexa.PromptStepData();

      const result = promptAdapter.fromDB(data);

      expect(result).eql({
        reprompt,
        buttons: null,
        noMatchReprompt: noMatches,
      });
    });

    it('returns correct data for empty values', () => {
      const noMatches = Creator.Block.Shared.VoiceNodeDataNoMatch();

      Sinon.stub(voiceNoMatchAdapter, 'fromDB').returns(noMatches);

      const data = Creator.Block.Alexa.PromptStepData({ reprompt: null });

      const result = promptAdapter.fromDB(data);

      expect(result).eql({
        buttons: null,
        reprompt: null,
        noMatchReprompt: noMatches,
      });
    });
  });

  describe('when transforming to db', () => {
    it('returns correct data for default values', () => {
      const reprompt = Creator.Block.Shared.VoicePrompt();
      const noMatches = Creator.Block.Shared.VoiceStepNoMatch();

      Sinon.stub(voicePromptAdapter, 'toDB').returns(reprompt);
      Sinon.stub(voiceNoMatchAdapter, 'toDB').returns(noMatches);

      const data = Creator.Block.Alexa.PromptNodeData();

      const result = promptAdapter.toDB(data);

      expect(result).eql({
        ports: [],
        chips: null,
        buttons: null,
        reprompt,
        noMatches,
      });
    });

    it('returns correct data for empty values', () => {
      const noMatches = Creator.Block.Shared.VoiceStepNoMatch();

      Sinon.stub(voiceNoMatchAdapter, 'toDB').returns(noMatches);

      const data = Creator.Block.Alexa.PromptNodeData({ reprompt: null });

      const result = promptAdapter.toDB(data);

      expect(result).eql({
        ports: [],
        chips: null,
        buttons: null,
        reprompt: null,
        noMatches,
      });
    });
  });
});
