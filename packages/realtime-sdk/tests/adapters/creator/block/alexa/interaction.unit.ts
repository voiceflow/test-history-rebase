import { Creator } from '@test/factories';
import { Utils } from '@voiceflow/common';
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
      const noMatch = Creator.Block.Shared.VoiceNodeDataNoMatch();

      const id = 'id';

      Sinon.stub(Utils.id.cuid, 'slug').returns(id);
      Sinon.stub(voiceNoMatchAdapter, 'fromDB').returns(noMatch);
      Sinon.stub(voiceNoReplyAdapter, 'fromDB').returns(noReply);

      const data = Creator.Block.Alexa.InteractionStepData();

      const result = interactionAdapter.fromDB(data);

      expect(result).eql(
        Creator.Block.Alexa.InteractionNodeData({
          name: data.name,
          choices: [
            Creator.Block.Base.ChoiceData({
              id,
              goTo: data.choices[0].goTo!,
              intent: data.choices[0].intent,
              action: data.choices[0].action!,
              mappings: data.choices[0].mappings!,
            }),
          ],
          buttons: null,
          noReply,
          noMatch,
          intentScope: undefined,
        })
      );
    });

    it('returns correct data for empty values', () => {
      const noMatch = Creator.Block.Shared.VoiceNodeDataNoMatch();
      const id = datatype.uuid();

      Sinon.stub(Utils.id.cuid, 'slug').returns(id);
      Sinon.stub(voiceNoMatchAdapter, 'fromDB').returns(noMatch);

      const data = Creator.Block.Alexa.InteractionStepData({ choices: [], reprompt: null, noReply: null });

      const result = interactionAdapter.fromDB(data);

      expect(result).eql({
        name: data.name,
        noMatch,
        choices: [],
        buttons: null,
        noReply: null,
        intentScope: undefined,
      });
    });
  });

  describe('when transforming to db', () => {
    it('returns correct data for default values', () => {
      const noReply = Creator.Block.Shared.VoiceStepNoReply();
      const noMatch = Creator.Block.Shared.VoiceStepNoMatch();

      Sinon.stub(voiceNoMatchAdapter, 'toDB').returns(noMatch);
      Sinon.stub(voiceNoReplyAdapter, 'toDB').returns(noReply);

      const data = Creator.Block.Alexa.InteractionNodeData();

      const result = interactionAdapter.toDB(data);

      expect(result).eql({
        name: data.name,
        noMatch,
        choices: [
          {
            goTo: data.choices[0].goTo,
            action: data.choices[0].action,
            intent: data.choices[0].intent,
            mappings: data.choices[0].mappings,
          },
        ],
        chips: null,
        noReply,
        buttons: null,
        intentScope: undefined,
      });
    });

    it('returns correct data for empty values', () => {
      const noMatch = Creator.Block.Shared.VoiceStepNoMatch();

      Sinon.stub(voiceNoMatchAdapter, 'toDB').returns(noMatch);

      const data = Creator.Block.Alexa.InteractionNodeData({ choices: [], noReply: null });

      const result = interactionAdapter.toDB(data);

      expect(result).eql({
        name: data.name,
        noMatch,
        chips: null,
        buttons: null,
        choices: [],
        noReply: null,
        intentScope: undefined,
      });
    });
  });
});
