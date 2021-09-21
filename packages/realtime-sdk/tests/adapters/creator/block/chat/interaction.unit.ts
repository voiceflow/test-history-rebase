import { Constants } from '@voiceflow/general-types';
import { expect } from 'chai';
import cuid from 'cuid';
import { datatype } from 'faker';
import sinon from 'sinon';

import interactionAdapter from '@/adapters/creator/block/chat/interaction';
import { chatNoMatchAdapter } from '@/adapters/creator/block/chat/utils';
import { chatRepromptAdapter } from '@/adapters/utils';
import { promptChatTypeFactory } from '@/tests/factories/chat/capture';
import { interactionNodeDataFactory, interactionStepDataFactory } from '@/tests/factories/chat/interaction';
import { chatNoMatchesFactory } from '@/tests/factories/chat/noMatches';

describe('Adapters | Creator | Block | Chat | interactionAdapter', () => {
  afterEach(() => {
    sinon.reset();
    sinon.restore();
  });

  describe('when transforming from db', () => {
    it('returns correct data', () => {
      const elseData = chatNoMatchesFactory();
      const reprompt = promptChatTypeFactory();
      const id = datatype.uuid();
      sinon.stub(cuid, 'slug').returns(id);
      sinon.stub(chatRepromptAdapter, 'fromDB').returns(reprompt);
      sinon.stub(chatNoMatchAdapter, 'fromDB').returns(elseData);
      const data = interactionStepDataFactory();

      const result = interactionAdapter.fromDB(data);

      expect(result).eql({
        name: data.name,
        else: elseData,
        choices: [
          {
            [Constants.PlatformType.ALEXA]: { id, intent: null, mappings: [] },
            [Constants.PlatformType.GENERAL]: { id, intent: data.choices[0].intent, mappings: data.choices[0].mappings },
            [Constants.PlatformType.GOOGLE]: { id, intent: null, mappings: [] },
          },
        ],
        reprompt,
        buttons: data.buttons,
      });
    });
  });

  describe('when transforming to db', () => {
    it('returns correct data', () => {
      const elseData = chatNoMatchesFactory();
      const reprompt = promptChatTypeFactory();
      const id = datatype.uuid();
      sinon.stub(cuid, 'slug').returns(id);
      sinon.stub(chatRepromptAdapter, 'toDB').returns(reprompt);
      sinon.stub(chatNoMatchAdapter, 'toDB').returns(elseData);
      const data = interactionNodeDataFactory();

      const result = interactionAdapter.toDB(data);

      expect(result).eql({
        name: data.name,
        else: elseData,
        choices: [{ intent: data.choices[0].general.intent, mappings: data.choices[0].general.mappings }],
        reprompt,
        buttons: data.buttons,
        chips: null,
      });
    });
  });
});
