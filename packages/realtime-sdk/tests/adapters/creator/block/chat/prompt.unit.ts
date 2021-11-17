import { Creator } from '@test/factories';
import { expect } from 'chai';
import Sinon from 'sinon';

import promptAdapter from '@/adapters/creator/block/chat/prompt';
import { chatNoMatchAdapter, chatPromptAdapter } from '@/adapters/creator/block/utils';

describe('Adapters | Creator | Block | Chat | promptAdapter', () => {
  afterEach(() => {
    Sinon.reset();
    Sinon.restore();
  });

  describe('when transforming from db', () => {
    it('returns correct data for default values', () => {
      const reprompt = Creator.Block.Shared.ChatPrompt();
      const noMatches = Creator.Block.Shared.ChatNodeDataNoMatch();

      Sinon.stub(chatPromptAdapter, 'fromDB').returns(reprompt);
      Sinon.stub(chatNoMatchAdapter, 'fromDB').returns(noMatches);

      const data = Creator.Block.Chat.PromptStepData();

      const result = promptAdapter.fromDB(data);

      expect(result).eql({
        buttons: data.buttons,
        reprompt,
        noMatchReprompt: noMatches,
      });
    });

    it('returns correct data for empty values', () => {
      const noMatches = Creator.Block.Shared.ChatNodeDataNoMatch();

      Sinon.stub(chatNoMatchAdapter, 'fromDB').returns(noMatches);

      const data = Creator.Block.Chat.PromptStepData({ reprompt: null });

      const result = promptAdapter.fromDB(data);

      expect(result).eql({
        buttons: data.buttons,
        reprompt: null,
        noMatchReprompt: noMatches,
      });
    });
  });

  describe('when transforming to db', () => {
    it('returns correct data for default values', () => {
      const reprompt = Creator.Block.Shared.ChatPrompt();
      const noMatches = Creator.Block.Shared.ChatStepNoMatch();

      Sinon.stub(chatPromptAdapter, 'toDB').returns(reprompt);
      Sinon.stub(chatNoMatchAdapter, 'toDB').returns(noMatches);

      const data = Creator.Block.Chat.PromptNodeData();

      const result = promptAdapter.toDB(data);

      expect(result).eql({
        ports: [],
        chips: null,
        buttons: data.buttons,
        reprompt,
        noMatches,
      });
    });

    it('returns correct data for empty values', () => {
      const noMatches = Creator.Block.Shared.ChatStepNoMatch();

      Sinon.stub(chatNoMatchAdapter, 'toDB').returns(noMatches);

      const data = Creator.Block.Chat.PromptNodeData({ reprompt: null });

      const result = promptAdapter.toDB(data);

      expect(result).eql({
        ports: [],
        chips: null,
        buttons: data.buttons,
        reprompt: null,
        noMatches,
      });
    });
  });
});
