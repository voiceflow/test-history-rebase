import { syncDynamicPortsLength, voicePromptAdapter } from '@realtime-sdk/adapters/creator/block/utils';
import { VoicePromptType } from '@realtime-sdk/constants';
import { Creator } from '@test/factories';
import { AlexaConstants } from '@voiceflow/alexa-types';
import { expect } from 'chai';

describe('Adapters | Creator | Block | Utils', () => {
  describe('voice reprompt adapter', () => {
    describe('when transforming from db', () => {
      describe('and type is audio', () => {
        it('returns correct step data', () => {
          const reprompt = Creator.Block.Shared.VoicePrompt({ voice: AlexaConstants.Voice.AUDIO });

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
          const data = Creator.Block.Shared.VoicePrompt({ voice: AlexaConstants.Voice.ADITI });

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
            voice: AlexaConstants.Voice.AUDIO,
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
            voice: AlexaConstants.Voice.ALEXA,
            content: reprompt.content,
          });
        });
      });
    });
  });

  describe('syncDynamicPortsLength', () => {
    it('undefined length', () => {
      const ports = { foo: 'bar' } as any;
      expect(syncDynamicPortsLength({ nodeID: 'nodeID', ports, length: undefined as any })).eql(ports);
      expect(syncDynamicPortsLength({ nodeID: 'nodeID', ports, length: null as any })).eql(ports);
      expect(syncDynamicPortsLength({ nodeID: 'nodeID', ports, length: 0.123 as any })).eql(ports);
    });

    it('equal length', () => {
      const ports = { dynamic: [{ id: 'port1' }, { id: 'port2' }], foo: 'bar' } as any;
      expect(syncDynamicPortsLength({ nodeID: 'nodeID', ports, length: 2 })).eql(ports);
    });

    it('shorter length', () => {
      const ports = { dynamic: [{ id: 'port1' }, { id: 'port2' }, { id: 'port3' }], foo: 'bar' } as any;
      expect(syncDynamicPortsLength({ nodeID: 'nodeID', ports, length: 1 })).eql({ ...ports, dynamic: [{ id: 'port1' }] });
    });

    it('longer length', () => {
      const ports = { dynamic: [{ id: 'port1' }], foo: 'bar' } as any;
      expect(syncDynamicPortsLength({ nodeID: 'nodeID', ports, length: 3 }).dynamic.length).eql(3);
      expect(syncDynamicPortsLength({ nodeID: 'nodeID', ports, length: 5 }).dynamic.length).eql(5);
      expect(syncDynamicPortsLength({ nodeID: 'nodeID', ports, length: 8 }).dynamic.length).eql(8);
    });
  });
});
