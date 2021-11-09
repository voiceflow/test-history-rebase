import { Constants } from '@voiceflow/alexa-types';
import { Utils } from '@voiceflow/common';
import { expect } from 'chai';
import { datatype } from 'faker';
import Sinon from 'sinon';

import speakAdapter from '@/adapters/creator/block/alexa/speak';
import { DialogType } from '@/constants';
import { audioDataFactory, speakNodeDataFactory, speakStepDataFactory, ssmlDataFactory } from '@/tests/factories/alexa/speak';
import { promptFactory } from '@/tests/factories/reprompt';

describe('Adapters | Creator | Block | Alexa | speakAdapter', () => {
  afterEach(() => {
    Sinon.reset();
    Sinon.restore();
  });

  describe('when transforming from db', () => {
    it('includes given data', () => {
      const data = speakStepDataFactory();

      const result = speakAdapter.fromDB(data);

      expect(result).includes({
        randomize: data.randomize,
        canvasVisibility: data.canvasVisibility,
      });
    });

    it('returns audio and voice dialogs', () => {
      const audioDialog = promptFactory({ voice: Constants.Voice.AUDIO });
      const voiceDialog = promptFactory({ voice: Constants.Voice.AMY });
      const id = datatype.uuid();
      Sinon.stub(Utils.id.cuid, 'slug').returns(id);
      const data = speakStepDataFactory({ dialogs: [audioDialog, voiceDialog] });

      const result = speakAdapter.fromDB(data);

      expect(result.dialogs).eql([
        { id, url: audioDialog.content, type: DialogType.AUDIO },
        { id, type: DialogType.VOICE, voice: voiceDialog.voice, content: voiceDialog.content },
      ]);
    });
  });

  describe('when transforming to db', () => {
    it('includes given data', () => {
      const data = speakNodeDataFactory();

      const result = speakAdapter.toDB(data);

      expect(result).includes({
        randomize: data.randomize,
        canvasVisibility: data.canvasVisibility,
      });
    });

    it('returns audio and voice dialogs', () => {
      const audioDialog = audioDataFactory();
      const voiceDialog = ssmlDataFactory({ voice: undefined, content: undefined });
      const data = speakNodeDataFactory({ dialogs: [audioDialog, voiceDialog] });

      const result = speakAdapter.toDB(data);

      expect(result.dialogs).eql([
        { voice: Constants.Voice.AUDIO, content: audioDialog.url },
        { voice: Constants.Voice.ALEXA, content: '' },
      ]);
    });
  });
});
