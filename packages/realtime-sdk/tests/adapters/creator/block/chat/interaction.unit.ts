import { Creator } from '@test/factories';
import { Utils } from '@voiceflow/common';
import { expect } from 'chai';
import { datatype } from 'faker';
import Sinon from 'sinon';

import interactionAdapter from '@/adapters/creator/block/chat/interaction';
import { chatNoMatchAdapter, chatNoReplyAdapter } from '@/adapters/creator/block/utils';

describe('Adapters | Creator | Block | Chat | interactionAdapter', () => {
  afterEach(() => {
    Sinon.reset();
    Sinon.restore();
  });

  describe('when transforming from db', () => {
    it('returns correct data for default values', () => {
      const noMatch = Creator.Block.Shared.ChatNodeDataNoMatch();
      const noReply = Creator.Block.Shared.ChatNodeDataNoReply();
      const id = 'id';

      Sinon.stub(Utils.id.cuid, 'slug').returns(id);
      Sinon.stub(chatNoMatchAdapter, 'fromDB').returns(noMatch);
      Sinon.stub(chatNoReplyAdapter, 'fromDB').returns(noReply);

      const data = Creator.Block.Chat.InteractionStepData();

      const result = interactionAdapter.fromDB(data);

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
      const id = datatype.uuid();

      Sinon.stub(Utils.id.cuid, 'slug').returns(id);
      Sinon.stub(chatNoMatchAdapter, 'fromDB').returns(noMatch);

      const data = Creator.Block.Chat.InteractionStepData({ choices: [], noReply: null, reprompt: null });

      const result = interactionAdapter.fromDB(data);

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

      Sinon.stub(chatNoMatchAdapter, 'toDB').returns(noMatch);
      Sinon.stub(chatNoReplyAdapter, 'toDB').returns(noReply);

      const data = Creator.Block.Chat.InteractionNodeData();

      const result = interactionAdapter.toDB(data);

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

      Sinon.stub(chatNoMatchAdapter, 'toDB').returns(noMatch);

      const data = Creator.Block.Chat.InteractionNodeData({ choices: [], noReply: null });

      const result = interactionAdapter.toDB(data);

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
