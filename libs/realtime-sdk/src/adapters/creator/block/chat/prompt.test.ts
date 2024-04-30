import { Creator } from '@test/factories';
import { afterAll, afterEach, describe, expect, it, vi } from 'vitest';

import { chatNoMatchAdapter, chatNoReplyAdapter } from '../utils';
import promptAdapter from './prompt';

describe('Adapters | Creator | Block | Chat | promptAdapter', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(() => {
    vi.resetAllMocks();
  });

  describe('when transforming from db', () => {
    it('returns correct data for default values', () => {
      const noReply = Creator.Block.Shared.ChatNodeDataNoReply();
      const noMatch = Creator.Block.Shared.ChatNodeDataNoMatch();

      vi.spyOn(chatNoReplyAdapter, 'fromDB').mockReturnValue(noReply);
      vi.spyOn(chatNoMatchAdapter, 'fromDB').mockReturnValue(noMatch);

      const data = Creator.Block.Chat.PromptStepData();

      const result = promptAdapter.fromDB(data, { context: {} });

      expect(result).eql({
        buttons: data.buttons,
        noReply,
        noMatch,
      });
    });

    it('returns correct data for empty values', () => {
      const noMatch = Creator.Block.Shared.ChatNodeDataNoMatch();

      vi.spyOn(chatNoMatchAdapter, 'fromDB').mockReturnValue(noMatch);

      const data = Creator.Block.Chat.PromptStepData({ noReply: null, reprompt: null });

      const result = promptAdapter.fromDB(data, { context: {} });

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

      vi.spyOn(chatNoReplyAdapter, 'toDB').mockReturnValue(noReply);
      vi.spyOn(chatNoMatchAdapter, 'toDB').mockReturnValue(noMatch);

      const data = Creator.Block.Chat.PromptNodeData();

      const result = promptAdapter.toDB(data, { context: {} });

      expect(result).eql({
        chips: null,
        buttons: data.buttons,
        noReply,
        noMatch,
      });
    });

    it('returns correct data for empty values', () => {
      const noMatch = Creator.Block.Shared.ChatStepNoMatch();

      vi.spyOn(chatNoMatchAdapter, 'toDB').mockReturnValue(noMatch);

      const data = Creator.Block.Chat.PromptNodeData({ noReply: null });

      const result = promptAdapter.toDB(data, { context: {} });

      expect(result).eql({
        chips: null,
        buttons: data.buttons,
        noReply: null,
        noMatch,
      });
    });
  });
});
