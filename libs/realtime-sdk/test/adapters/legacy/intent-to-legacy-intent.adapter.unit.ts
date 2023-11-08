import { intentToLegacyIntent } from '@realtime-sdk/adapters/legacy/intent-to-legacy-intent/intent-to-legacy-intent.adapter';
import { BaseModels } from '@voiceflow/base-types';
import { ChatModels } from '@voiceflow/chat-types';
import { Utils } from '@voiceflow/common';
import type { AnyResponseVariant, Entity, Intent, RequiredEntity, Response, ResponseDiscriminator, Variable } from '@voiceflow/sdk-logux-designer';
import { CardLayout, Channel, Language, ResponseContext, ResponseVariantType, Utterance, VariableDatatype } from '@voiceflow/sdk-logux-designer';
import { VoiceModels } from '@voiceflow/voice-types';

describe('Adapters | Legacy | intentToLegacyIntent', () => {
  const creatorID = 1;
  const createdAt = '2021-01-01T00:00:00.000Z';
  const assistantID = 'assistant-id';
  const environmentID = 'environment-id';

  const intent1: Intent = {
    id: 'intent-1',
    name: 'intent-1-name',
    folderID: null,
    updatedAt: createdAt,
    createdAt,
    entityOrder: [],
    createdByID: creatorID,
    updatedByID: creatorID,
    description: null,
    assistantID,
    environmentID,
    automaticReprompt: false,
  };

  const legacyIntent1: BaseModels.Intent = {
    key: 'intent-1',
    name: 'intent-1-name',
    slots: [],
    inputs: [],
    noteID: undefined,
  };

  const intent2: Intent = {
    ...intent1,
    id: 'intent-2',
    name: 'intent-2-name',
    description: 'intent-2-description',
  };

  const note1: BaseModels.AnyNote = {
    id: 'note-1',
    type: BaseModels.NoteType.INTENT,
    text: 'intent-2-description',
    meta: { intentID: 'intent-2' },
    mentions: [],
  };

  const legacyIntent2: BaseModels.Intent = {
    key: 'intent-2',
    name: 'intent-2-name',
    slots: [],
    inputs: [{ slots: [], text: 'utterance-1-text' }],
    noteID: note1.id,
  };

  const intent3: Intent = {
    ...intent1,
    id: 'intent-3',
    name: 'intent-3-name',
    entityOrder: ['required-entity-1'],
    description: 'intent-3-description',
  };

  const note2: BaseModels.AnyNote = {
    id: 'note-2',
    type: BaseModels.NoteType.INTENT,
    text: 'intent-3-description',
    meta: { intentID: 'intent-3' },
    mentions: [],
  };

  const legacyIntent3: BaseModels.Intent = {
    key: 'intent-3',
    name: 'intent-3-name',
    slots: [
      {
        id: 'entity-1',
        dialog: { prompt: [], confirm: [], utterances: [], confirmEnabled: false },
        required: true,
      },
      {
        id: 'entity-2',
        dialog: { prompt: [], confirm: [], utterances: [], confirmEnabled: false },
        required: false,
      },
    ],
    inputs: [
      {
        text: 'utterance-2-text-1 {{[entity-1-name].entity-1}} utterance-2-text-2 {{[entity-2-name].entity-2}}',
        slots: ['entity-1', 'entity-2'],
      },
    ],
    noteID: note2.id,
  };

  const intent4: Intent = {
    ...intent1,
    id: 'intent-4',
    name: 'intent-4-name',
    entityOrder: ['required-entity-3'],
  };

  const legacyIntent4: ChatModels.Intent = {
    key: 'intent-4',
    name: 'intent-4-name',
    slots: [
      {
        id: 'entity-2',
        dialog: {
          prompt: [
            {
              id: '1',
              content: [
                { color: '#f0f', text: 'response-variant-3-text-1 ' },
                { id: 'entity-2', name: 'entity-2-name', type: 'variable', isSlot: true, children: [{ text: '' }] },
                { children: [{ text: ' response-variant-3-text-2 ' }] },
                { id: 'variable-1', name: 'variable-1-name', type: 'variable', isSlot: false, children: [{ text: '' }] },
                { url: 'example.com', type: 'link', children: [{ text: ' response-variant-3-text-3' }] },
              ] as any[],
            },
          ],
          confirm: [],
          utterances: [],
          confirmEnabled: false,
        },
        required: true,
      },
    ],
    inputs: [
      {
        text: 'utterance-3-text-1 {{[entity-2-name].entity-2}} utterance-3-text-2',
        slots: ['entity-2'],
      },
    ],
    noteID: undefined,
  };

  const legacyIntent4Voice: VoiceModels.Intent<any> = {
    ...legacyIntent4,
    slots: [
      {
        id: 'entity-2',
        dialog: {
          prompt: [
            {
              text: 'response-variant-3-text-1 {{[entity-2-name].entity-2}} response-variant-3-text-2 {{[variable-1].variable-1}} response-variant-3-text-3',
            },
          ],
          confirm: [],
          utterances: [],
          confirmEnabled: false,
        },
        required: true,
      },
    ],
  };

  const utterance1: Utterance = {
    id: 'utterance-1',
    text: [{ text: ['utterance-1-text'] }],
    language: Language.ENGLISH_US,
    intentID: 'intent-2',
    createdAt,
    updatedAt: createdAt,
    assistantID,
    environmentID,
  };

  const utterance2: Utterance = {
    ...utterance1,
    id: 'utterance-2',
    text: [{ text: ['utterance-2-text-1 ', { entityID: 'entity-1' }, ' utterance-2-text-2 ', { entityID: 'entity-2' }] }],
    intentID: 'intent-3',
  };

  const utterance3: Utterance = {
    ...utterance1,
    id: 'utterance-3',
    text: [{ text: ['utterance-3-text-1 ', { entityID: 'entity-2' }, ' utterance-3-text-2'] }],
    intentID: 'intent-4',
  };

  const requiredEntity1: RequiredEntity = {
    id: 'required-entity-1',
    entityID: 'entity-1',
    intentID: 'intent-3',
    createdAt,
    repromptID: null,
    assistantID,
    environmentID,
  };

  const requiredEntity2: RequiredEntity = {
    ...requiredEntity1,
    id: 'required-entity-2',
    entityID: 'entity-2',
    repromptID: 'response-1',
  };

  const requiredEntity3: RequiredEntity = {
    ...requiredEntity1,
    id: 'required-entity-3',
    intentID: 'intent-4',
    entityID: 'entity-2',
    repromptID: 'response-2',
  };

  const entity1: Entity = {
    id: 'entity-1',
    name: 'entity-1-name',
    color: '#000',
    isArray: false,
    folderID: null,
    createdAt,
    updatedAt: createdAt,
    classifier: 'classifier-1',
    createdByID: creatorID,
    updatedByID: creatorID,
    description: null,
    assistantID,
    environmentID,
  };

  const entity2: Entity = {
    ...entity1,
    id: 'entity-2',
    name: 'entity-2-name',
    color: '#515151',
    classifier: null,
  };

  const response1: Response = {
    id: 'response-1',
    name: 'response-1-name',
    folderID: null,
    createdAt,
    updatedAt: createdAt,
    createdByID: creatorID,
    updatedByID: creatorID,
    assistantID,
    environmentID,
  };

  const response2: Response = {
    ...response1,
    id: 'response-2',
    name: "Required Entity's Reprompt",
  };

  const responseDiscriminator1: ResponseDiscriminator = {
    id: 'response-discriminator-1',
    channel: Channel.DEFAULT,
    language: Language.ENGLISH_US,
    createdAt,
    updatedAt: createdAt,
    responseID: 'response-1',
    assistantID,
    variantOrder: ['response-variant-1', 'response-variant-2'],
    environmentID,
  };

  const responseDiscriminator2: ResponseDiscriminator = {
    ...responseDiscriminator1,
    id: 'response-discriminator-2',
    responseID: 'response-2',
    variantOrder: ['response-variant-3', 'response-variant-4'],
  };

  const responseVariant1: AnyResponseVariant = {
    id: 'response-variant-1',
    type: ResponseVariantType.TEXT,
    text: ['response-variant-1-text'],
    speed: null,
    createdAt,
    updatedAt: createdAt,
    cardLayout: CardLayout.CAROUSEL,
    conditionID: null,
    assistantID,
    environmentID,
    discriminatorID: 'response-discriminator-1',
    attachmentOrder: [],
  };

  const responseVariant2: AnyResponseVariant = {
    ...responseVariant1,
    id: 'response-variant-2',
    text: [
      { text: ['response-variant-2-text-1'], attributes: { __type: 'text', color: '#f0f' } },
      { entityID: 'entity-1' },
      { text: ['response-variant-2-text-2'] },
    ],
  };

  const responseVariant3: AnyResponseVariant = {
    ...responseVariant1,
    id: 'response-variant-3',
    discriminatorID: 'response-discriminator-2',
    text: [
      { text: ['response-variant-3-text-1 '], attributes: { __type: 'text', color: '#f0f' } },
      { entityID: 'entity-2' },
      { text: [' response-variant-3-text-2 '] },
      { variableID: 'variable-1' },
      { text: [' response-variant-3-text-3'], attributes: { __type: 'link', url: 'example.com' } },
    ],
  };

  const responseVariant4: AnyResponseVariant = {
    id: 'response-variant-4',
    type: ResponseVariantType.PROMPT,
    turns: 1,
    context: ResponseContext.KNOWLEDGE_BASE,
    promptID: null,
    createdAt,
    updatedAt: createdAt,
    conditionID: null,
    assistantID,
    environmentID,
    discriminatorID: 'response-discriminator-1',
    attachmentOrder: [],
  };

  const variable1: Variable = {
    id: 'variable-1',
    name: 'variable-1-name',
    color: '#000',
    system: null,
    isArray: false,
    datatype: VariableDatatype.TEXT,
    folderID: null,
    createdAt,
    updatedAt: createdAt,
    createdByID: creatorID,
    updatedByID: creatorID,
    assistantID,
    description: null,
    defaultValue: 'variable-1-default-value',
    environmentID,
  };

  beforeEach(() => {
    vi.useFakeTimers();

    vi.setSystemTime(new Date(createdAt));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('fromDB', () => {
    const entitiesMapByID = { [entity1.id]: entity1, [entity2.id]: entity2 };
    const variablesMapByID = { [variable1.id]: variable1 };
    const responsesMap = { [response1.id]: response1, [response2.id]: response2 };
    const requiredEntitiesMap = {
      [requiredEntity1.id]: requiredEntity1,
      [requiredEntity2.id]: requiredEntity2,
      [requiredEntity3.id]: requiredEntity3,
    };
    const responseVariantsMap = {
      [responseVariant1.id]: responseVariant1,
      [responseVariant2.id]: responseVariant2,
      [responseVariant3.id]: responseVariant3,
      [responseVariant4.id]: responseVariant4,
    };
    const responseDiscriminatorsPerResponse = {
      [response1.id]: [responseDiscriminator1],
      [response2.id]: [responseDiscriminator2],
    };

    it('returns correct data for empty intent', () => {
      expect(
        intentToLegacyIntent.fromDB(
          {
            intent: intent1,
            utterances: [],
            responsesMap: {},
            requiredEntitiesMap: {},
            responseVariantsMap: {},
            responseDiscriminatorsPerResponse: {},
          },
          { variablesMapByID, entitiesMapByID, isVoiceAssistant: false }
        )
      ).toEqual({ intent: legacyIntent1, note: null });
    });

    it('returns correct data for intent with utterance and description', () => {
      vi.spyOn(Utils.id.cuid, 'slug').mockReturnValueOnce(note1.id);

      expect(
        intentToLegacyIntent.fromDB(
          {
            intent: intent2,
            utterances: [utterance1],
            responsesMap: {},
            requiredEntitiesMap: {},
            responseVariantsMap: {},
            responseDiscriminatorsPerResponse: {},
          },
          { variablesMapByID, entitiesMapByID, isVoiceAssistant: false }
        )
      ).toEqual({ intent: legacyIntent2, note: note1 });
    });

    it('returns correct data for intent with required entities', () => {
      vi.spyOn(Utils.id.cuid, 'slug').mockReturnValueOnce(note2.id);

      expect(
        intentToLegacyIntent.fromDB(
          {
            intent: intent3,
            utterances: [utterance2],
            responsesMap,
            requiredEntitiesMap,
            responseVariantsMap,
            responseDiscriminatorsPerResponse,
          },
          { variablesMapByID, entitiesMapByID, isVoiceAssistant: false }
        )
      ).toEqual({ intent: legacyIntent3, note: note2 });
    });

    it('returns correct data for intent with required entities and response variants', () => {
      vi.spyOn(Utils.id.cuid, 'slug').mockReturnValue('1');

      expect(
        intentToLegacyIntent.fromDB(
          {
            intent: intent4,
            utterances: [utterance3],
            responsesMap,
            requiredEntitiesMap,
            responseVariantsMap,
            responseDiscriminatorsPerResponse,
          },
          { variablesMapByID, entitiesMapByID, isVoiceAssistant: false }
        )
      ).toEqual({ intent: legacyIntent4, note: null });
    });

    it('returns correct data for intent with required entities and response variants for voice assistant', () => {
      expect(
        intentToLegacyIntent.fromDB(
          {
            intent: intent4,
            utterances: [utterance3],
            responsesMap,
            requiredEntitiesMap,
            responseVariantsMap,
            responseDiscriminatorsPerResponse,
          },
          { variablesMapByID, entitiesMapByID, isVoiceAssistant: true }
        )
      ).toEqual({ intent: legacyIntent4Voice, note: null });
    });
  });

  describe('mapFromDB', () => {
    it('returns correct data', () => {
      vi.spyOn(Utils.id.cuid, 'slug').mockReturnValueOnce(note1.id).mockReturnValueOnce(note2.id).mockReturnValue('1');

      expect(
        intentToLegacyIntent.mapFromDB(
          {
            intents: [intent1, intent2, intent3, intent4],
            utterances: [utterance1, utterance2, utterance3],
            responses: [response1, response2],
            requiredEntities: [requiredEntity1, requiredEntity2, requiredEntity3],
            responseVariants: [responseVariant1, responseVariant2, responseVariant3, responseVariant4],
            responseDiscriminators: [responseDiscriminator1, responseDiscriminator2],
          },
          { variables: [variable1], entities: [entity1, entity2], isVoiceAssistant: false }
        )
      ).toEqual({ intents: [legacyIntent1, legacyIntent2, legacyIntent3, legacyIntent4], notes: [note1, note2] });
    });
  });

  describe('toDB', () => {
    it('returns correct data for empty intent', () => {
      expect(intentToLegacyIntent.toDB({ note: null, intent: legacyIntent1 }, { creatorID, assistantID, environmentID })).toEqual({
        intent: intent1,
        utterances: [],
        responsesMap: {},
        requiredEntitiesMap: {},
        responseVariantsMap: {},
        responseDiscriminatorsPerResponse: {},
      });
    });

    it('returns correct data for intent with utterance and description', () => {
      vi.spyOn(Utils.id, 'objectID').mockReturnValueOnce(utterance1.id);

      expect(intentToLegacyIntent.toDB({ intent: legacyIntent2, note: note1 }, { creatorID, assistantID, environmentID })).toEqual({
        intent: intent2,
        utterances: [utterance1],
        responsesMap: {},
        requiredEntitiesMap: {},
        responseVariantsMap: {},
        responseDiscriminatorsPerResponse: {},
      });
    });

    it('returns correct data for intent with required entities', () => {
      vi.spyOn(Utils.id, 'objectID').mockReturnValueOnce(utterance2.id).mockReturnValueOnce(requiredEntity1.id);

      expect(intentToLegacyIntent.toDB({ intent: legacyIntent3, note: note2 }, { creatorID, assistantID, environmentID })).toEqual({
        intent: intent3,
        utterances: [utterance2],
        responsesMap: {},
        requiredEntitiesMap: { [requiredEntity1.id]: requiredEntity1 },
        responseVariantsMap: {},
        responseDiscriminatorsPerResponse: {},
      });
    });

    it('returns correct data for intent with required entities and response variants', () => {
      vi.spyOn(Utils.id, 'objectID')
        .mockReturnValueOnce(utterance3.id)
        .mockReturnValueOnce(requiredEntity3.id)
        .mockReturnValueOnce(response2.id)
        .mockReturnValueOnce(responseDiscriminator2.id)
        .mockReturnValueOnce(responseVariant3.id);

      expect(intentToLegacyIntent.toDB({ note: null, intent: legacyIntent4 }, { creatorID, assistantID, environmentID })).toEqual({
        intent: intent4,
        utterances: [utterance3],
        responsesMap: { [response2.id]: response2 },
        requiredEntitiesMap: { [requiredEntity3.id]: requiredEntity3 },
        responseVariantsMap: { [responseVariant3.id]: responseVariant3 },
        responseDiscriminatorsPerResponse: { [response2.id]: [{ ...responseDiscriminator2, variantOrder: [responseVariant3.id] }] },
      });
    });
  });

  describe('mapToDB', () => {
    it('returns correct data', () => {
      vi.spyOn(Utils.id, 'objectID')
        .mockReturnValueOnce(utterance1.id)
        .mockReturnValueOnce(utterance2.id)
        .mockReturnValueOnce(requiredEntity1.id)
        .mockReturnValueOnce(utterance3.id)
        .mockReturnValueOnce(requiredEntity3.id)
        .mockReturnValueOnce(response2.id)
        .mockReturnValueOnce(responseDiscriminator2.id)
        .mockReturnValueOnce(responseVariant3.id);

      expect(
        intentToLegacyIntent.mapToDB(
          {
            notes: [note1, note2],
            intents: [legacyIntent1, legacyIntent2, legacyIntent3, legacyIntent4],
          },
          { creatorID, assistantID, environmentID }
        )
      ).toEqual({
        intents: [intent1, intent2, intent3, intent4],
        responses: [response2],
        utterances: [utterance1, utterance2, utterance3],
        requiredEntities: [requiredEntity1, requiredEntity3],
        responseVariants: [responseVariant3],
        responseDiscriminators: [{ ...responseDiscriminator2, variantOrder: [responseVariant3.id] }],
      });
    });
  });
});
