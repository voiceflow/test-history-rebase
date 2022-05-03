import { Creator } from '@test/factories';
import { expect } from 'chai';
import Sinon from 'sinon';

import promptAdapter from '@/adapters/creator/block/chat/prompt';
import { chatNoMatchAdapter, chatNoReplyAdapter } from '@/adapters/creator/block/utils';

describe('Adapters | Creator | Block | Chat | promptAdapter', () => {
  afterEach(() => {
    Sinon.reset();
    Sinon.restore();
  });

  describe('when transforming from db', () => {
    it('returns correct data for default values', () => {
      const noReply = Creator.Block.Shared.ChatNodeDataNoReply();
      const noMatch = Creator.Block.Shared.ChatNodeDataNoMatch();

      Sinon.stub(chatNoReplyAdapter, 'fromDB').returns(noReply);
      Sinon.stub(chatNoMatchAdapter, 'fromDB').returns(noMatch);

      const data = Creator.Block.Chat.PromptStepData();

      const result = promptAdapter.fromDB(data);

      expect(result).eql({
        buttons: data.buttons,
        noReply,
        noMatch,
      });
    });

    it('returns correct data for empty values', () => {
      const noMatch = Creator.Block.Shared.ChatNodeDataNoMatch();

      Sinon.stub(chatNoMatchAdapter, 'fromDB').returns(noMatch);

      const data = Creator.Block.Chat.PromptStepData({ noReply: null, reprompt: null });

      const result = promptAdapter.fromDB(data);

      expect(result).eql({
        buttons: data.buttons,
        noReply: null,
        noMatch,
      });
    });
  });

  describe('when transforming to db', () => {
    it('returns correct data for default values', () => {
      const noReply = Creator.Block.Shared.ChatNodeDataNoReply();
      const noMatch = Creator.Block.Shared.ChatStepNoMatch();

      Sinon.stub(chatNoReplyAdapter, 'toDB').returns(noReply);
      Sinon.stub(chatNoMatchAdapter, 'toDB').returns(noMatch);

      const data = Creator.Block.Chat.PromptNodeData();

      const result = promptAdapter.toDB(data);

      expect(result).eql({
        chips: null,
        buttons: data.buttons,
        noReply,
        noMatch,
      });
    });

    it('returns correct data for empty values', () => {
      const noMatch = Creator.Block.Shared.ChatStepNoMatch();

      Sinon.stub(chatNoMatchAdapter, 'toDB').returns(noMatch);

      const data = Creator.Block.Chat.PromptNodeData({ noReply: null });

      const result = promptAdapter.toDB(data);

      expect(result).eql({
        chips: null,
        buttons: data.buttons,
        noReply: null,
        noMatch,
      });
    });
  });
});
