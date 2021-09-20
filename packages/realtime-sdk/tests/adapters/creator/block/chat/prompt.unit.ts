import { Button } from '@voiceflow/base-types';
import { expect } from 'chai';
import Sinon from 'sinon';

import promptAdapter from '@/adapters/creator/block/chat/prompt';
import { chatNoMatchAdapter } from '@/adapters/creator/block/chat/utils';
import { chatRepromptAdapter } from '@/adapters/utils';
import { chipFactory, promptChatTypeFactory } from '@/tests/factories/chat/capture';
import { chatNoMatchesFactory } from '@/tests/factories/chat/noMatches';
import { promptNodeDataFactory, promptStepDataFactory } from '@/tests/factories/chat/prompt';
import { intentButtonFactory } from '@/tests/factories/intent';

describe('Adapters | Creator | Block | Chat | promptAdapter', () => {
  afterEach(() => {
    Sinon.reset();
    Sinon.restore();
  });

  describe('when transforming from db', () => {
    it('returns correct data for default values', () => {
      const noMatches = chatNoMatchesFactory();
      const reprompt = promptChatTypeFactory();
      const intentButton = intentButtonFactory();
      Sinon.stub(chatRepromptAdapter, 'fromDB').returns(reprompt);
      Sinon.stub(chatNoMatchAdapter, 'fromDB').returns(noMatches);
      const data = promptStepDataFactory({ buttons: [intentButton] });

      const result = promptAdapter.fromDB(data);

      expect(result).eql({
        buttons: [intentButton],
        reprompt,
        noMatchReprompt: noMatches,
      });
    });

    it('returns correct data for empty values', () => {
      const chip = chipFactory();
      const data = promptStepDataFactory({ buttons: undefined, chips: [chip], reprompt: undefined });

      const result = promptAdapter.fromDB(data);

      expect(result.buttons).eql([{ name: chip.label, type: Button.ButtonType.INTENT, payload: { intentID: null } }]);
      expect(result.reprompt).eql(undefined);
    });
  });

  describe('when transforming to db', () => {
    it('returns correct data for default values', () => {
      const noMatches = chatNoMatchesFactory();
      const reprompt = promptChatTypeFactory();
      const intentButton = intentButtonFactory();
      Sinon.stub(chatRepromptAdapter, 'toDB').returns(reprompt);
      Sinon.stub(chatNoMatchAdapter, 'toDB').returns(noMatches);
      const data = promptNodeDataFactory({ buttons: [intentButton] });

      const result = promptAdapter.toDB(data);

      expect(result).eql({
        buttons: [intentButton],
        reprompt,
        noMatches,
        ports: [],
        chips: null,
      });
    });

    it('returns correct data for empty values', () => {
      const noMatches = chatNoMatchesFactory();
      Sinon.stub(chatNoMatchAdapter, 'toDB').returns(noMatches);
      const data = promptNodeDataFactory({ reprompt: undefined });

      const result = promptAdapter.toDB(data);

      expect(result.reprompt).eql(undefined);
    });
  });
});
