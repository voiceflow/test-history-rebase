import { Utils } from '@voiceflow/common';
import { Constants } from '@voiceflow/general-types';
import { expect } from 'chai';
import { datatype } from 'faker';
import Sinon from 'sinon';

import interactionAdapter from '@/adapters/creator/block/alexa/interaction';
import { voiceNoMatchAdapter, voicePromptAdapter } from '@/adapters/creator/block/utils';
import { Creator } from '@/tests/factories';

describe('Adapters | Creator | Block | Alexa | interactionAdapter', () => {
  afterEach(() => {
    Sinon.reset();
    Sinon.restore();
  });

  describe('when transforming from db', () => {
    it('returns correct data for default values', () => {
      const elseData = Creator.Block.Shared.VoiceNodeDataNoMatch();
      const reprompt = Creator.Block.Shared.VoiceNodeDataPrompt();
      const id = 'id';

      Sinon.stub(Utils.id.cuid, 'slug').returns(id);
      Sinon.stub(voiceNoMatchAdapter, 'fromDB').returns(elseData);
      Sinon.stub(voicePromptAdapter, 'fromDB').returns(reprompt);

      const data = Creator.Block.Alexa.InteractionStepData();

      const result = interactionAdapter.fromDB(data);

      expect(result).eql(
        Creator.Block.Alexa.InteractionNodeData({
          name: data.name,
          else: elseData,
          choices: [
            Creator.Block.Base.ChoiceDistinctPlatformsData({
              [Constants.PlatformType.ALEXA]: {
                id,
                goTo: data.choices[0].goTo!,
                intent: data.choices[0].intent,
                action: data.choices[0].action!,
                mappings: data.choices[0].mappings!,
              },
            }),
          ],
          buttons: null,
          reprompt,
        })
      );
    });

    it('returns correct data for empty values', () => {
      const elseData = Creator.Block.Shared.VoiceNodeDataNoMatch();
      const reprompt = Creator.Block.Shared.VoiceNodeDataPrompt();
      const id = datatype.uuid();

      Sinon.stub(Utils.id.cuid, 'slug').returns(id);
      Sinon.stub(voiceNoMatchAdapter, 'fromDB').returns(elseData);
      Sinon.stub(voicePromptAdapter, 'fromDB').returns(reprompt);

      const data = Creator.Block.Alexa.InteractionStepData({ choices: [], reprompt: null });

      const result = interactionAdapter.fromDB(data);

      expect(result).eql({
        name: data.name,
        else: elseData,
        choices: [],
        reprompt: null,
        buttons: null,
      });
    });
  });

  describe('when transforming to db', () => {
    it('returns correct data for default values', () => {
      const reprompt = Creator.Block.Shared.VoicePrompt();
      const elseData = Creator.Block.Shared.VoiceStepNoMatch();

      Sinon.stub(voiceNoMatchAdapter, 'toDB').returns(elseData);
      Sinon.stub(voicePromptAdapter, 'toDB').returns(reprompt);

      const data = Creator.Block.Alexa.InteractionNodeData();

      const result = interactionAdapter.toDB(data);

      expect(result).eql({
        name: data.name,
        else: elseData,
        choices: [
          {
            goTo: data.choices[0].alexa.goTo,
            action: data.choices[0].alexa.action,
            intent: data.choices[0].alexa.intent,
            mappings: data.choices[0].alexa.mappings,
          },
        ],
        chips: null,
        buttons: null,
        reprompt,
      });
    });

    it('returns correct data for empty values', () => {
      const elseData = Creator.Block.Shared.VoiceStepNoMatch();

      Sinon.stub(voiceNoMatchAdapter, 'toDB').returns(elseData);

      const data = Creator.Block.Alexa.InteractionNodeData({ choices: [], reprompt: null });

      const result = interactionAdapter.toDB(data);

      expect(result).eql({
        name: data.name,
        else: elseData,
        chips: null,
        buttons: null,
        choices: [],
        reprompt: null,
      });
    });
  });
});
