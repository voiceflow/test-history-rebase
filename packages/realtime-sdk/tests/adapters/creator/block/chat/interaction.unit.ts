import { Creator } from '@test/factories';
import { Utils } from '@voiceflow/common';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
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
      const elseData = Creator.Block.Shared.ChatNodeDataNoMatch();
      const noReply = Creator.Block.Shared.ChatNodeDataNoReply();
      const id = 'id';

      Sinon.stub(Utils.id.cuid, 'slug').returns(id);
      Sinon.stub(chatNoMatchAdapter, 'fromDB').returns(elseData);
      Sinon.stub(chatNoReplyAdapter, 'fromDB').returns(noReply);

      const data = Creator.Block.Chat.InteractionStepData();

      const result = interactionAdapter.fromDB(data);

      expect(result).eql(
        Creator.Block.Chat.InteractionNodeData({
          name: data.name,
          else: elseData,
          choices: [
            Creator.Block.Base.ChoiceDistinctPlatformsData({
              [VoiceflowConstants.PlatformType.GENERAL]: {
                id,
                goTo: data.choices[0].goTo!,
                intent: data.choices[0].intent,
                action: data.choices[0].action!,
                mappings: data.choices[0].mappings!,
              },
            }),
          ],
          buttons: data.buttons,
          noReply,
        })
      );
    });

    it('returns correct data for empty values', () => {
      const elseData = Creator.Block.Shared.ChatNodeDataNoMatch();
      const id = datatype.uuid();

      Sinon.stub(Utils.id.cuid, 'slug').returns(id);
      Sinon.stub(chatNoMatchAdapter, 'fromDB').returns(elseData);

      const data = Creator.Block.Chat.InteractionStepData({ choices: [], noReply: null, reprompt: null });

      const result = interactionAdapter.fromDB(data);

      expect(result).eql({
        name: data.name,
        else: elseData,
        choices: [],
        noReply: null,
        buttons: data.buttons,
      });
    });
  });

  describe('when transforming to db', () => {
    it('returns correct data for default values', () => {
      const noReply = Creator.Block.Shared.ChatStepNoReply();
      const elseData = Creator.Block.Shared.ChatStepNoMatch();

      Sinon.stub(chatNoMatchAdapter, 'toDB').returns(elseData);
      Sinon.stub(chatNoReplyAdapter, 'toDB').returns(noReply);

      const data = Creator.Block.Chat.InteractionNodeData();

      const result = interactionAdapter.toDB(data);

      expect(result).eql({
        name: data.name,
        else: elseData,
        choices: [
          {
            goTo: data.choices[0].general.goTo,
            action: data.choices[0].general.action,
            intent: data.choices[0].general.intent,
            mappings: data.choices[0].general.mappings,
          },
        ],
        chips: null,
        buttons: data.buttons,
        noReply,
      });
    });

    it('returns correct data for empty values', () => {
      const elseData = Creator.Block.Shared.ChatStepNoMatch();

      Sinon.stub(chatNoMatchAdapter, 'toDB').returns(elseData);

      const data = Creator.Block.Chat.InteractionNodeData({ choices: [], noReply: null });

      const result = interactionAdapter.toDB(data);

      expect(result).eql({
        name: data.name,
        else: elseData,
        chips: null,
        buttons: data.buttons,
        choices: [],
        noReply: null,
      });
    });
  });
});
