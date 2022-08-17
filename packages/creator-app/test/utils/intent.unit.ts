/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable max-nested-callbacks */
import * as Realtime from '@voiceflow/realtime-sdk';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import suite from '@/../test/_suite';
import { formatUtterance, UTTERANCE_ERROR_MESSAGES, validateUtterance } from '@/utils/intent';

suite('utils/intent', () => {
  describe('utterances', () => {
    describe('when formatting', () => {
      describe('and there are no formatters', () => {
        it('returns given text', () => {
          const utterance = 'Hello from voiceflow';
          expect(formatUtterance(VoiceflowConstants.PlatformType.LEX, utterance)).toBe(utterance);
        });
      });

      describe('and platform is alexa', () => {
        it('removes all numbers', () => {
          const utterance = 'Hello from alexa with numbers 123081230';
          expect(formatUtterance(VoiceflowConstants.PlatformType.ALEXA, utterance)).toBe('Hello from alexa with numbers ');
        });
      });

      describe('and platform is google', () => {
        it('removes all numbers', () => {
          const utterance = 'Hello from google with numbers 123081230';
          expect(formatUtterance(VoiceflowConstants.PlatformType.GOOGLE, utterance)).toBe('Hello from google with numbers ');
        });
      });
    });

    describe('when validating', () => {
      describe('and utterance is empty', () => {
        it('returns an error', () => {
          expect(validateUtterance('', '123', [], VoiceflowConstants.PlatformType.VOICEFLOW)).toBe(UTTERANCE_ERROR_MESSAGES.EMPTY);
        });
      });

      describe('and intent already have an utterance with same text', () => {
        it('returns an error', () => {
          const platform = VoiceflowConstants.PlatformType.VOICEFLOW;
          const intents: Realtime.Intent[] = [
            { id: '123', inputs: [{ text: 'hello' }], name: 'intent name', platform, slots: { allKeys: [], byKey: {} } },
          ];

          expect(validateUtterance('hello', '123', intents, platform)).toBe(UTTERANCE_ERROR_MESSAGES.INTENT_CONFLICT);
        });
      });

      describe('and other intent already have an utterance with same text', () => {
        it('returns an error', () => {
          const platform = VoiceflowConstants.PlatformType.VOICEFLOW;
          const intents: Realtime.Intent[] = [
            { id: '1234', inputs: [{ text: 'hello from voiceflow' }], name: 'intent name', platform, slots: { allKeys: [], byKey: {} } },
            { id: '123', inputs: [{ text: 'hello' }], name: 'other intent', platform, slots: { allKeys: [], byKey: {} } },
          ];

          expect(validateUtterance('hello from voiceflow', '123', intents, platform)).toBe(
            UTTERANCE_ERROR_MESSAGES.OTHER_INTENT_CONFLICT('intent name')
          );
        });
      });

      describe('to alexa platform', () => {
        it('does not return error for a simple text', () => {
          expect(validateUtterance('my utterance text', '123', [], VoiceflowConstants.PlatformType.ALEXA)).toBe('');
        });

        describe('and utterance contains numbers', () => {
          it('returns an error', () => {
            expect(validateUtterance('daosnd12317', '123', [], VoiceflowConstants.PlatformType.ALEXA)).toBe(UTTERANCE_ERROR_MESSAGES.NUMBER);
          });
        });

        describe('and utterance contains valid special characters', () => {
          it('does not returns error', () => {
            expect(validateUtterance('sdaipa_-.{}', '123', [], VoiceflowConstants.PlatformType.ALEXA)).toBe('');
          });
        });

        // TO DO: add this scenario back
        describe.skip('and utterance contains invalid special characters', () => {
          it('does not returns error', () => {
            expect(validateUtterance('sdaipa_-.{}$#', '123', [], VoiceflowConstants.PlatformType.ALEXA)).toBe(
              UTTERANCE_ERROR_MESSAGES.SPECIAL_CHARACTERS
            );
          });
        });
      });

      describe('and platform is google', () => {
        it('does not return error for a simple text', () => {
          expect(validateUtterance('my utterance text', '123', [], VoiceflowConstants.PlatformType.GOOGLE)).toBe('');
        });

        describe('and utterance contains numbers', () => {
          it('returns an error', () => {
            expect(validateUtterance('daosnd12317', '123', [], VoiceflowConstants.PlatformType.GOOGLE)).toBe(UTTERANCE_ERROR_MESSAGES.NUMBER);
          });
        });

        describe('and utterance contains valid special characters', () => {
          it('does not render an error', () => {
            expect(validateUtterance('sdaipa_-.{}', '123', [], VoiceflowConstants.PlatformType.GOOGLE)).toBe('');
          });
        });

        // TO DO: add this scenario back
        describe.skip('and utterance contains invalid special characters', () => {
          it('does not render an error', () => {
            expect(validateUtterance('sdaipa_-.{}$#', '123', [], VoiceflowConstants.PlatformType.GOOGLE)).toBe(
              UTTERANCE_ERROR_MESSAGES.SPECIAL_CHARACTERS
            );
          });
        });
      });

      describe('and is other platform', () => {
        it('does not return error for a simple text', () => {
          expect(validateUtterance('my utterance text', '123', [], VoiceflowConstants.PlatformType.VOICEFLOW)).toBe('');
        });

        it('allows numbers', () => {
          expect(validateUtterance('my utterance text with numbers 1203871203871230', '123', [], VoiceflowConstants.PlatformType.DIALOGFLOW_ES)).toBe(
            ''
          );
        });

        it('allows special characters', () => {
          expect(validateUtterance('my utterance text with special $#%#%@!#!(@#@ˆ', '123', [], VoiceflowConstants.PlatformType.RASA)).toBe('');
        });
      });
    });
  });
});
