import { Constants } from '@voiceflow/alexa-types';
import { expect } from 'chai';

import { voiceRepromptAdapter } from '@/adapters/creator/block/utils';
import { RepromptType } from '@/constants';
import { voicePromptNodeDataFactory, voiceTypePromptFactory } from '@/tests/factories/voice';

describe('Adapters | Creator | Block | Utils', () => {
  describe('voice reprompt adapter', () => {
    describe('when transforming from db', () => {
      describe('and type is audio', () => {
        it('returns correct step data', () => {
          const reprompt = voiceTypePromptFactory({ voice: Constants.Voice.AUDIO });

          const result = voiceRepromptAdapter.fromDB(reprompt);

          expect(result.id).to.be.a('string');
          expect(result).to.include({
            type: RepromptType.AUDIO,
            desc: reprompt.desc,
            voice: null,
            audio: reprompt.content,
            content: '',
          });
        });
      });

      describe('and type is text', () => {
        it('returns correct step data', () => {
          const data = voiceTypePromptFactory({ voice: Constants.Voice.ADITI });

          const result = voiceRepromptAdapter.fromDB(data);

          expect(result.id).to.be.a('string');
          expect(result).include({
            type: RepromptType.TEXT,
            desc: data.desc,
            voice: data.voice,
            audio: null,
            content: data.content,
          });
        });
      });
    });

    describe('when transforming to db', () => {
      describe('and reprompt type is audio', () => {
        it('returns correct node data', () => {
          const reprompt = voicePromptNodeDataFactory({ desc: null, type: RepromptType.AUDIO });

          const result = voiceRepromptAdapter.toDB(reprompt);

          expect(result).eql({
            desc: undefined,
            voice: Constants.Voice.AUDIO,
            content: reprompt.audio,
          });
        });
      });

      describe('and reprompt type is not audio', () => {
        it('returns correct node data', () => {
          const reprompt = voicePromptNodeDataFactory({ type: RepromptType.TEXT, voice: null });

          const result = voiceRepromptAdapter.toDB(reprompt);

          expect(result).eql({
            desc: reprompt.desc,
            voice: Constants.Voice.ALEXA,
            content: reprompt.content,
          });
        });
      });
    });
  });
});
