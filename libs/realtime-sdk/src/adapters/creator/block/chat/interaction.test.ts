import { faker } from '@faker-js/faker';
import { Creator } from '@test/factories';
import { Utils } from '@voiceflow/common';
import { afterAll, afterEach, describe, expect, it, vi } from 'vitest';

import { chatNoMatchAdapter, chatNoReplyAdapter } from '../utils';
import interactionAdapter from './interaction';

describe('Adapters | Creator | Block | Chat | interactionAdapter', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(() => {
    vi.resetAllMocks();
  });

  describe('when transforming from db', () => {
    it('returns correct data for default values', () => {
      const noMatch = Creator.Block.Shared.ChatNodeDataNoMatch();
      const noReply = Creator.Block.Shared.ChatNodeDataNoReply();
      const id = 'id';

      vi.spyOn(Utils.id.cuid, 'slug').mockReturnValue(id);
      vi.spyOn(chatNoMatchAdapter, 'fromDB').mockReturnValue(noMatch);
      vi.spyOn(chatNoReplyAdapter, 'fromDB').mockReturnValue(noReply);

      const data = Creator.Block.Chat.InteractionStepData();

      const result = interactionAdapter.fromDB(data, { context: {} });

      expect(result).eql(
        Creator.Block.Chat.InteractionNodeData({
          name: data.name,
          noMatch,
          choices: [
            Creator.Block.Base.ChoiceData({
              id,
              intent: data.choices[0].intent,
              mappings: data.choices[0].mappings!,
            }),
          ],
          buttons: data.buttons,
          noReply,
          intentScope: undefined,
        })
      );
    });

    it('returns correct data for empty values', () => {
      const noMatch = Creator.Block.Shared.ChatNodeDataNoMatch();
      const id = faker.datatype.uuid();

      vi.spyOn(Utils.id.cuid, 'slug').mockReturnValue(id);
      vi.spyOn(chatNoMatchAdapter, 'fromDB').mockReturnValue(noMatch);

      const data = Creator.Block.Chat.InteractionStepData({ choices: [], noReply: null, reprompt: null });

      const result = interactionAdapter.fromDB(data, { context: {} });

      expect(result).eql({
        name: data.name,
        noMatch,
        choices: [],
        noReply: null,
        buttons: data.buttons,
        intentScope: undefined,
      });
    });
  });

  describe('when transforming to db', () => {
    it('returns correct data for default values', () => {
      const noReply = Creator.Block.Shared.ChatStepNoReply();
      const noMatch = Creator.Block.Shared.ChatStepNoMatch();

      vi.spyOn(chatNoMatchAdapter, 'toDB').mockReturnValue(noMatch);
      vi.spyOn(chatNoReplyAdapter, 'toDB').mockReturnValue(noReply);

      const data = Creator.Block.Chat.InteractionNodeData();

      const result = interactionAdapter.toDB(data, { context: {} });

      expect(result).eql({
        name: data.name,
        noMatch,
        choices: [
          {
            intent: data.choices[0].intent,
            mappings: data.choices[0].mappings,
          },
        ],
        chips: null,
        buttons: data.buttons,
        noReply,
        intentScope: undefined,
      });
    });

    it('returns correct data for empty values', () => {
      const noMatch = Creator.Block.Shared.ChatStepNoMatch();

      vi.spyOn(chatNoMatchAdapter, 'toDB').mockReturnValue(noMatch);

      const data = Creator.Block.Chat.InteractionNodeData({ choices: [], noReply: null });

      const result = interactionAdapter.toDB(data, { context: {} });

      expect(result).eql({
        name: data.name,
        noMatch,
        chips: null,
        buttons: data.buttons,
        choices: [],
        noReply: null,
        intentScope: undefined,
      });
    });
  });
});
