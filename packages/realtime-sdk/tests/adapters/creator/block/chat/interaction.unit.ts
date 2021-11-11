import { Utils } from '@voiceflow/common';
import { Constants } from '@voiceflow/general-types';
import { expect } from 'chai';
import { datatype } from 'faker';
import Sinon from 'sinon';

import interactionAdapter from '@/adapters/creator/block/chat/interaction';
import { chatNoMatchAdapter, chatPromptAdapter } from '@/adapters/creator/block/utils';
import { Creator } from '@/tests/factories';

describe('Adapters | Creator | Block | Chat | interactionAdapter', () => {
  afterEach(() => {
    Sinon.reset();
    Sinon.restore();
  });

  describe('when transforming from db', () => {
    it('returns correct data for default values', () => {
      const elseData = Creator.Block.Shared.ChatNodeDataNoMatch();
      const reprompt = Creator.Block.Shared.ChatPrompt();
      const id = 'id';

      Sinon.stub(Utils.id.cuid, 'slug').returns(id);
      Sinon.stub(chatNoMatchAdapter, 'fromDB').returns(elseData);
      Sinon.stub(chatPromptAdapter, 'fromDB').returns(reprompt);

      const data = Creator.Block.Chat.InteractionStepData();

      const result = interactionAdapter.fromDB(data);

      expect(result).eql(
        Creator.Block.Chat.InteractionNodeData({
          name: data.name,
          else: elseData,
          choices: [
            Creator.Block.Base.ChoiceDistinctPlatformsData({
              [Constants.PlatformType.GENERAL]: {
                id,
                goTo: data.choices[0].goTo!,
                intent: data.choices[0].intent,
                action: data.choices[0].action!,
                mappings: data.choices[0].mappings!,
              },
            }),
          ],
          buttons: data.buttons,
          reprompt,
        })
      );
    });

    it('returns correct data for empty values', () => {
      const elseData = Creator.Block.Shared.ChatNodeDataNoMatch();
      const reprompt = Creator.Block.Shared.ChatPrompt();
      const id = datatype.uuid();

      Sinon.stub(Utils.id.cuid, 'slug').returns(id);
      Sinon.stub(chatNoMatchAdapter, 'fromDB').returns(elseData);
      Sinon.stub(chatPromptAdapter, 'fromDB').returns(reprompt);

      const data = Creator.Block.Chat.InteractionStepData({ choices: [], reprompt: null });

      const result = interactionAdapter.fromDB(data);

      expect(result).eql({
        name: data.name,
        else: elseData,
        choices: [],
        reprompt: null,
        buttons: data.buttons,
      });
    });
  });

  describe('when transforming to db', () => {
    it('returns correct data for default values', () => {
      const reprompt = Creator.Block.Shared.ChatPrompt();
      const elseData = Creator.Block.Shared.ChatStepNoMatch();

      Sinon.stub(chatNoMatchAdapter, 'toDB').returns(elseData);
      Sinon.stub(chatPromptAdapter, 'toDB').returns(reprompt);

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
        reprompt,
      });
    });

    it('returns correct data for empty values', () => {
      const elseData = Creator.Block.Shared.ChatStepNoMatch();

      Sinon.stub(chatNoMatchAdapter, 'toDB').returns(elseData);

      const data = Creator.Block.Chat.InteractionNodeData({ choices: [], reprompt: null });

      const result = interactionAdapter.toDB(data);

      expect(result).eql({
        name: data.name,
        else: elseData,
        chips: null,
        buttons: data.buttons,
        choices: [],
        reprompt: null,
      });
    });
  });
});
