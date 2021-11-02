import { Node as BaseNode } from '@voiceflow/base-types';
import { Constants } from '@voiceflow/general-types';
import { expect } from 'chai';
import cuid from 'cuid';
import { datatype } from 'faker';
import Sinon from 'sinon';

import interactionAdapter from '@/adapters/creator/block/alexa/interaction';
import { voiceNoMatchAdapter, voiceRepromptAdapter } from '@/adapters/creator/block/utils';
import { interactionNodeDataFactory, interactionStepDataFactory } from '@/tests/factories/alexa/interaction';
import { stepNoMatchPromptFactory } from '@/tests/factories/noMatch';
import { promptFactory } from '@/tests/factories/reprompt';
import { noMatchesNodeDataFactory, voicePromptNodeDataFactory } from '@/tests/factories/voice';

describe('Adapters | Creator | Block | Alexa | interactionAdapter', () => {
  afterEach(() => {
    Sinon.reset();
    Sinon.restore();
  });

  describe('when transforming from db', () => {
    it('returns correct data for default values', () => {
      const elseData = noMatchesNodeDataFactory();
      const reprompt = voicePromptNodeDataFactory();
      const id = datatype.uuid();
      Sinon.stub(cuid, 'slug').returns(id);
      Sinon.stub(voiceNoMatchAdapter, 'fromDB').returns(elseData);
      Sinon.stub(voiceRepromptAdapter, 'fromDB').returns(reprompt);
      const data = interactionStepDataFactory();

      const result = interactionAdapter.fromDB(data);

      expect(result).eql({
        name: data.name,
        else: elseData,
        choices: [
          {
            [Constants.PlatformType.GENERAL]: {
              id,
              goTo: null,
              intent: '',
              action: BaseNode.Interaction.ChoiceAction.PATH,
              mappings: [],
            },
            [Constants.PlatformType.GOOGLE]: {
              id,
              goTo: null,
              intent: '',
              action: BaseNode.Interaction.ChoiceAction.PATH,
              mappings: [],
            },
            [Constants.PlatformType.ALEXA]: {
              id,
              goTo: null,
              intent: data.choices[0].intent,
              action: BaseNode.Interaction.ChoiceAction.PATH,
              mappings: data.choices[0].mappings,
            },
          },
        ],
        reprompt,
        buttons: null,
      });
    });

    it('returns correct data for empty values', () => {
      const elseData = noMatchesNodeDataFactory();
      const reprompt = voicePromptNodeDataFactory();
      const id = datatype.uuid();
      Sinon.stub(cuid, 'slug').returns(id);
      Sinon.stub(voiceNoMatchAdapter, 'fromDB').returns(elseData);
      Sinon.stub(voiceRepromptAdapter, 'fromDB').returns(reprompt);
      const data = interactionStepDataFactory({ choices: [], reprompt: undefined });

      const result = interactionAdapter.fromDB(data);

      expect(result).eql({
        name: data.name,
        else: elseData,
        choices: [],
        reprompt: undefined,
        buttons: null,
      });
    });
  });

  describe('when transforming to db', () => {
    it('returns correct data for default values', () => {
      const elseData = stepNoMatchPromptFactory();
      const reprompt = promptFactory();
      Sinon.stub(voiceNoMatchAdapter, 'toDB').returns(elseData);
      Sinon.stub(voiceRepromptAdapter, 'toDB').returns(reprompt);
      const data = interactionNodeDataFactory();

      const result = interactionAdapter.toDB(data);

      expect(result).eql({
        name: data.name,
        else: elseData,
        choices: [
          {
            goTo: undefined,
            action: undefined,
            intent: data.choices[0].alexa.intent,
            mappings: data.choices[0].alexa.mappings,
          },
        ],
        reprompt,
        chips: null,
        buttons: null,
      });
    });

    it('returns correct data for empty values', () => {
      const elseData = stepNoMatchPromptFactory();
      Sinon.stub(voiceNoMatchAdapter, 'toDB').returns(elseData);
      const data = interactionNodeDataFactory({ choices: [], reprompt: undefined });

      const result = interactionAdapter.toDB(data);

      expect(result).eql({
        name: data.name,
        else: elseData,
        choices: [],
        reprompt: undefined,
        chips: null,
        buttons: null,
      });
    });
  });
});
