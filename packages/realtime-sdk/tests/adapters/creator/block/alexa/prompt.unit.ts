import { expect } from 'chai';
import Sinon from 'sinon';

import promptAdapter from '@/adapters/creator/block/alexa/prompt';
import { voiceNoMatchAdapter, voiceRepromptAdapter } from '@/adapters/creator/block/utils';
import { promptNodeDataFactory, promptStepDataFactory } from '@/tests/factories/alexa/prompt';
import { stepNoMatchPromptFactory } from '@/tests/factories/noMatch';
import { promptFactory } from '@/tests/factories/reprompt';
import { noMatchesNodeDataFactory, voicePromptNodeDataFactory } from '@/tests/factories/voice';

describe('Adapters | Creator | Block | promptAdapter', () => {
  afterEach(() => {
    Sinon.reset();
    Sinon.restore();
  });

  describe('when transforming from db', () => {
    it('returns correct data for default values', () => {
      const noMatches = noMatchesNodeDataFactory();
      const reprompt = voicePromptNodeDataFactory();
      Sinon.stub(voiceRepromptAdapter, 'fromDB').returns(reprompt);
      Sinon.stub(voiceNoMatchAdapter, 'fromDB').returns(noMatches);
      const data = promptStepDataFactory();

      const result = promptAdapter.fromDB(data);

      expect(result).eql({
        reprompt,
        noMatchReprompt: noMatches,
        buttons: null,
      });
    });

    it('returns correct data for empty values', () => {
      const noMatches = noMatchesNodeDataFactory();
      Sinon.stub(voiceNoMatchAdapter, 'fromDB').returns(noMatches);
      const data = promptStepDataFactory({ reprompt: undefined });

      const result = promptAdapter.fromDB(data);

      expect(result).eql({
        reprompt: undefined,
        noMatchReprompt: noMatches,
        buttons: null,
      });
    });
  });

  describe('when transforming to db', () => {
    it('returns correct data for default values', () => {
      const noMatches = stepNoMatchPromptFactory();
      const reprompt = promptFactory();
      Sinon.stub(voiceRepromptAdapter, 'toDB').returns(reprompt);
      Sinon.stub(voiceNoMatchAdapter, 'toDB').returns(noMatches);
      const data = promptNodeDataFactory();

      const result = promptAdapter.toDB(data);

      expect(result).eql({
        ports: [],
        reprompt,
        noMatches,
        chips: null,
        buttons: null,
      });
    });

    it('returns correct data for empty values', () => {
      const noMatches = stepNoMatchPromptFactory();
      Sinon.stub(voiceNoMatchAdapter, 'toDB').returns(noMatches);
      const data = promptNodeDataFactory({ reprompt: undefined });

      const result = promptAdapter.toDB(data);

      expect(result).eql({
        ports: [],
        reprompt: undefined,
        noMatches,
        chips: null,
        buttons: null,
      });
    });
  });
});
