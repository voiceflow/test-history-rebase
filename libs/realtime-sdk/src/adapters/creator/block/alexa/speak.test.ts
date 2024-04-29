import { faker } from '@faker-js/faker';
import speakAdapter from '@realtime-sdk/adapters/creator/block/alexa/speak';
import { DialogType } from '@realtime-sdk/constants';
import { Creator } from '@test/factories';
import { AlexaConstants } from '@voiceflow/alexa-types';
import { Utils } from '@voiceflow/common';

describe('Adapters | Creator | Block | Alexa | speakAdapter', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(() => {
    vi.resetAllMocks();
  });

  describe('when transforming from db', () => {
    it('includes given data', () => {
      const data = Creator.Block.Alexa.SpeakStepData();

      const result = speakAdapter.fromDB(data, { context: {} });

      expect(result).includes({
        randomize: data.randomize,
        canvasVisibility: data.canvasVisibility,
      });
    });

    it('returns audio and voice dialogs', () => {
      const audioDialog = Creator.Block.Shared.VoicePrompt({ voice: AlexaConstants.Voice.AUDIO });
      const voiceDialog = Creator.Block.Shared.VoicePrompt({ voice: AlexaConstants.Voice.AMY });
      const id = faker.datatype.uuid();

      vi.spyOn(Utils.id.cuid, 'slug').mockReturnValue(id);

      const data = Creator.Block.Alexa.SpeakStepData({ dialogs: [audioDialog, voiceDialog] });

      const result = speakAdapter.fromDB(data, { context: {} });

      expect(result.dialogs).eql([
        { id, url: audioDialog.content, type: DialogType.AUDIO },
        { id, type: DialogType.VOICE, voice: voiceDialog.voice, content: voiceDialog.content },
      ]);
    });
  });

  describe('when transforming to db', () => {
    it('includes given data', () => {
      const data = Creator.Block.Alexa.SpeakNodeData();

      const result = speakAdapter.toDB(data, { context: {} });

      expect(result).includes({
        randomize: data.randomize,
        canvasVisibility: data.canvasVisibility,
      });
    });

    it('returns audio and voice dialogs', () => {
      const audioDialog = Creator.Block.Voice.SpeakAudioData();
      const voiceDialog = Creator.Block.Voice.SpeakSSMLData({ voice: undefined, content: undefined });
      const data = Creator.Block.Alexa.SpeakNodeData({ dialogs: [audioDialog, voiceDialog] });

      const result = speakAdapter.toDB(data, { context: {} });

      expect(result.dialogs).eql([
        { voice: AlexaConstants.Voice.AUDIO, content: audioDialog.url },
        { voice: AlexaConstants.Voice.ALEXA, content: '' },
      ]);
    });
  });
});
