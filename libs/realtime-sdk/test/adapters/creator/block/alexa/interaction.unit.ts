import { faker } from '@faker-js/faker';
import interactionAdapter from '@realtime-sdk/adapters/creator/block/alexa/interaction';
import { voiceNoMatchAdapter, voiceNoReplyAdapter } from '@realtime-sdk/adapters/creator/block/utils';
import { Creator } from '@test/factories';
import { Utils } from '@voiceflow/common';

describe('Adapters | Creator | Block | Alexa | interactionAdapter', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  afterAll(() => {
    vi.resetAllMocks();
  });

  describe('when transforming from db', () => {
    it('returns correct data for default values', () => {
      const noReply = Creator.Block.Shared.VoiceNodeDataNoReply();
      const noMatch = Creator.Block.Shared.VoiceNodeDataNoMatch();

      const id = 'id';

      vi.spyOn(Utils.id.cuid, 'slug').mockReturnValue(id);
      vi.spyOn(voiceNoMatchAdapter, 'fromDB').mockReturnValue(noMatch);
      vi.spyOn(voiceNoReplyAdapter, 'fromDB').mockReturnValue(noReply);

      const data = Creator.Block.Alexa.InteractionStepData();

      const result = interactionAdapter.fromDB(data, { context: {} });

      expect(result).eql(
        Creator.Block.Alexa.InteractionNodeData({
          name: data.name,
          choices: [
            Creator.Block.Base.ChoiceData({
              id,
              intent: data.choices[0].intent,
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
      const id = faker.datatype.uuid();

      vi.spyOn(Utils.id.cuid, 'slug').mockReturnValue(id);
      vi.spyOn(voiceNoMatchAdapter, 'fromDB').mockReturnValue(noMatch);

      const data = Creator.Block.Alexa.InteractionStepData({ choices: [], reprompt: null, noReply: null });

      const result = interactionAdapter.fromDB(data, { context: {} });

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

      vi.spyOn(voiceNoMatchAdapter, 'toDB').mockReturnValue(noMatch);
      vi.spyOn(voiceNoReplyAdapter, 'toDB').mockReturnValue(noReply);

      const data = Creator.Block.Alexa.InteractionNodeData();

      const result = interactionAdapter.toDB(data, { context: {} });

      expect(result).eql({
        name: data.name,
        noMatch,
        choices: [
          {
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

      vi.spyOn(voiceNoMatchAdapter, 'toDB').mockReturnValue(noMatch);

      const data = Creator.Block.Alexa.InteractionNodeData({ choices: [], noReply: null });

      const result = interactionAdapter.toDB(data, { context: {} });

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
