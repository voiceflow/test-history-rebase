import { Creator } from '@test/factories';
import { Utils } from '@voiceflow/common';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';
import { expect } from 'chai';
import { datatype } from 'faker';
import Sinon from 'sinon';

import interactionAdapter from '@/adapters/creator/block/alexa/interaction';
import { voiceNoMatchAdapter, voiceNoReplyAdapter } from '@/adapters/creator/block/utils';

describe('Adapters | Creator | Block | Alexa | interactionAdapter', () => {
  afterEach(() => {
    Sinon.reset();
    Sinon.restore();
  });

  describe('when transforming from db', () => {
    it('returns correct data for default values', () => {
      const noReply = Creator.Block.Shared.VoiceNodeDataNoReply();
      const elseData = Creator.Block.Shared.VoiceNodeDataNoMatch();

      const id = 'id';

      Sinon.stub(Utils.id.cuid, 'slug').returns(id);
      Sinon.stub(voiceNoMatchAdapter, 'fromDB').returns(elseData);
      Sinon.stub(voiceNoReplyAdapter, 'fromDB').returns(noReply);

      const data = Creator.Block.Alexa.InteractionStepData();

      const result = interactionAdapter.fromDB(data);

      expect(result).eql(
        Creator.Block.Alexa.InteractionNodeData({
          name: data.name,
          else: elseData,
          choices: [
            Creator.Block.Base.ChoiceDistinctPlatformsData({
              [VoiceflowConstants.PlatformType.ALEXA]: {
                id,
                goTo: data.choices[0].goTo!,
                intent: data.choices[0].intent,
                action: data.choices[0].action!,
                mappings: data.choices[0].mappings!,
              },
            }),
          ],
          buttons: null,
          noReply,
        })
      );
    });

    it('returns correct data for empty values', () => {
      const elseData = Creator.Block.Shared.VoiceNodeDataNoMatch();
      const id = datatype.uuid();

      Sinon.stub(Utils.id.cuid, 'slug').returns(id);
      Sinon.stub(voiceNoMatchAdapter, 'fromDB').returns(elseData);

      const data = Creator.Block.Alexa.InteractionStepData({ choices: [], reprompt: null, noReply: null });

      const result = interactionAdapter.fromDB(data);

      expect(result).eql({
        name: data.name,
        else: elseData,
        choices: [],
        buttons: null,
        noReply: null,
      });
    });
  });

  describe('when transforming to db', () => {
    it('returns correct data for default values', () => {
      const noReply = Creator.Block.Shared.VoiceStepNoReply();
      const elseData = Creator.Block.Shared.VoiceStepNoMatch();

      Sinon.stub(voiceNoMatchAdapter, 'toDB').returns(elseData);
      Sinon.stub(voiceNoReplyAdapter, 'toDB').returns(noReply);

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
        noReply,
        buttons: null,
      });
    });

    it('returns correct data for empty values', () => {
      const elseData = Creator.Block.Shared.VoiceStepNoMatch();

      Sinon.stub(voiceNoMatchAdapter, 'toDB').returns(elseData);

      const data = Creator.Block.Alexa.InteractionNodeData({ choices: [], noReply: null });

      const result = interactionAdapter.toDB(data);

      expect(result).eql({
        name: data.name,
        else: elseData,
        chips: null,
        buttons: null,
        choices: [],
        noReply: null,
      });
    });
  });
});
