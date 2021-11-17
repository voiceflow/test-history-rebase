import { voicePromptAdapter } from '@realtime-sdk/adapters/creator/block/utils';
import { VoicePromptType } from '@realtime-sdk/constants';
import { Creator } from '@test/factories';
import { Constants } from '@voiceflow/alexa-types';
import { expect } from 'chai';

describe('Adapters | Creator | Block | Utils', () => {
  describe('voice reprompt adapter', () => {
    describe('when transforming from db', () => {
      describe('and type is audio', () => {
        it('returns correct step data', () => {
          const reprompt = Creator.Block.Shared.VoicePrompt({ voice: Constants.Voice.AUDIO });

          const result = voicePromptAdapter.fromDB(reprompt);

          expect(result.id).to.be.a('string');
          expect(result).to.include({
            type: VoicePromptType.AUDIO,
            desc: reprompt.desc,
            voice: null,
            audio: reprompt.content,
            content: '',
          });
        });
      });

      describe('and type is text', () => {
        it('returns correct step data', () => {
          const data = Creator.Block.Shared.VoicePrompt({ voice: Constants.Voice.ADITI });

          const result = voicePromptAdapter.fromDB(data);

          expect(result.id).to.be.a('string');
          expect(result).include({
            type: VoicePromptType.TEXT,
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
          const reprompt = Creator.Block.Shared.VoiceNodeDataPrompt({ desc: null, type: VoicePromptType.AUDIO });

          const result = voicePromptAdapter.toDB(reprompt);

          expect(result).eql({
            desc: undefined,
            voice: Constants.Voice.AUDIO,
            content: reprompt.audio,
          });
        });
      });

      describe('and reprompt type is not audio', () => {
        it('returns correct node data', () => {
          const reprompt = Creator.Block.Shared.VoiceNodeDataPrompt({ type: VoicePromptType.TEXT, voice: null });

          const result = voicePromptAdapter.toDB(reprompt);

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
