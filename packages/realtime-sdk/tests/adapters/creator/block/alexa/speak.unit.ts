import { Constants } from '@voiceflow/alexa-types';
import { Utils } from '@voiceflow/common';
import { expect } from 'chai';
import { datatype } from 'faker';
import Sinon from 'sinon';

import speakAdapter from '@/adapters/creator/block/alexa/speak';
import { DialogType } from '@/constants';
import { Creator } from '@/tests/factories';

describe('Adapters | Creator | Block | Alexa | speakAdapter', () => {
  afterEach(() => {
    Sinon.reset();
    Sinon.restore();
  });

  describe('when transforming from db', () => {
    it('includes given data', () => {
      const data = Creator.Block.Alexa.SpeakStepData();

      const result = speakAdapter.fromDB(data);

      expect(result).includes({
        randomize: data.randomize,
        canvasVisibility: data.canvasVisibility,
      });
    });

    it('returns audio and voice dialogs', () => {
      const audioDialog = Creator.Block.Shared.VoicePrompt({ voice: Constants.Voice.AUDIO });
      const voiceDialog = Creator.Block.Shared.VoicePrompt({ voice: Constants.Voice.AMY });
      const id = datatype.uuid();

      Sinon.stub(Utils.id.cuid, 'slug').returns(id);

      const data = Creator.Block.Alexa.SpeakStepData({ dialogs: [audioDialog, voiceDialog] });

      const result = speakAdapter.fromDB(data);

      expect(result.dialogs).eql([
        { id, url: audioDialog.content, type: DialogType.AUDIO },
        { id, type: DialogType.VOICE, voice: voiceDialog.voice, content: voiceDialog.content },
      ]);
    });
  });

  describe('when transforming to db', () => {
    it('includes given data', () => {
      const data = Creator.Block.Alexa.SpeakNodeData();

      const result = speakAdapter.toDB(data);

      expect(result).includes({
        randomize: data.randomize,
        canvasVisibility: data.canvasVisibility,
      });
    });

    it('returns audio and voice dialogs', () => {
      const audioDialog = Creator.Block.Voice.SpeakAudioData();
      const voiceDialog = Creator.Block.Voice.SpeakSSMLData({ voice: undefined, content: undefined });
      const data = Creator.Block.Alexa.SpeakNodeData({ dialogs: [audioDialog, voiceDialog] });

      const result = speakAdapter.toDB(data);

      expect(result.dialogs).eql([
        { voice: Constants.Voice.AUDIO, content: audioDialog.url },
        { voice: Constants.Voice.ALEXA, content: '' },
      ]);
    });
  });
});
