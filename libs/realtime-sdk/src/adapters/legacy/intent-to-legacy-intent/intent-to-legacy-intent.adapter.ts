/* eslint-disable sonarjs/cognitive-complexity */
import { BaseModels } from '@voiceflow/base-types';
import { ChatModels } from '@voiceflow/chat-types';
import { Nullable, Utils } from '@voiceflow/common';
import type {
  AnyResponseVariant,
  Entity,
  Intent,
  RequiredEntity,
  Response,
  ResponseDiscriminator,
  TextResponseVariant,
  Utterance,
  UtteranceText,
  Variable,
} from '@voiceflow/dtos';
import { CardLayout, Channel, Language, ResponseVariantType } from '@voiceflow/dtos';
import { VoiceModels } from '@voiceflow/voice-types';
import { createSimpleAdapter } from 'bidirectional-adapter';
import groupBy from 'lodash/groupBy';

import { getMarkupEntityIDs, markupToSlate, markupToString } from './intent-to-legacy-intent.util';

interface Input {
  intent: Intent;
  utterances: Utterance[];
  responsesMap: { [responseID: string]: Nullable<Response> };
  responseVariantsMap: { [responseVariant: string]: Nullable<AnyResponseVariant> };
  requiredEntitiesMap: { [requiredEntityID: string]: Nullable<RequiredEntity> };
  responseDiscriminatorsPerResponse: { [responseID: string]: ResponseDiscriminator[] };
}

interface Output {
  note: Nullable<BaseModels.IntentNote>;
  intent: BaseModels.Intent;
}

interface ToDBOptions {
  creatorID: number;
  assistantID: string;
  legacySlotMap: Record<string, BaseModels.Slot>;
  environmentID: string;
}

interface FromDBOptions {
  entitiesMapByID: Partial<Record<string, Entity>>;
  variablesMapByID: Partial<Record<string, Variable>>;
  isVoiceAssistant: boolean;
}

const adapter = createSimpleAdapter<Input, Output, [FromDBOptions], [ToDBOptions]>(
  (
    { intent, utterances, responsesMap, responseVariantsMap, requiredEntitiesMap, responseDiscriminatorsPerResponse },
    { entitiesMapByID, variablesMapByID, isVoiceAssistant }
  ) => {
    const inputs: BaseModels.IntentInput[] = utterances.map((utterance) => ({
      text: markupToString.fromDB(utterance.text, { entitiesMapByID }),
      slots: getMarkupEntityIDs(utterance.text),
    }));

    const allSlotIDs = Utils.array.unique(inputs.flatMap((input) => input.slots ?? []));

    const slotsMap = allSlotIDs.reduce<Record<string, BaseModels.IntentSlot>>(
      (acc, id) => ({
        ...acc,
        [id]: {
          id,
          dialog: { prompt: [], confirm: [], utterances: [], confirmEnabled: false },
          required: false,
        },
      }),
      {}
    );

    const note: Nullable<BaseModels.IntentNote> = intent.description
      ? {
          id: Utils.id.cuid.slug(),
          type: BaseModels.NoteType.INTENT,
          text: intent.description,
          meta: { intentID: intent.id },
          mentions: [],
        }
      : null;

    intent.entityOrder.forEach((requiredEntityID) => {
      const requiredEntity = requiredEntitiesMap[requiredEntityID];

      if (!requiredEntity) return;

      const intentSlot: BaseModels.IntentSlot = {
        id: requiredEntity.entityID,
        dialog: { prompt: [], confirm: [], utterances: [], confirmEnabled: false },
        required: true,
      };

      slotsMap[requiredEntity.entityID] = intentSlot;

      const response = requiredEntity.repromptID ? responsesMap[requiredEntity.repromptID] : null;

      if (!response) return;

      const discriminators = responseDiscriminatorsPerResponse[response.id] ?? [];

      const variants = discriminators.flatMap((discriminator) =>
        discriminator.variantOrder
          .map((variantID) => responseVariantsMap[variantID] ?? null)
          .filter((variant): variant is TextResponseVariant => !!variant && variant.type === ResponseVariantType.TEXT)
      );

      if (!variants.length) return;

      intentSlot.dialog.prompt = isVoiceAssistant
        ? variants.map((variant): VoiceModels.IntentPrompt<any> => ({ text: markupToString.fromDB(variant.text, { entitiesMapByID }) }))
        : variants.map(
            (variant): ChatModels.Prompt => ({
              id: variant.id,
              content: markupToSlate.fromDB(variant.text, { entitiesMapByID, variablesMapByID }),
            })
          );
    });

    return {
      intent: {
        key: intent.id,
        name: intent.name,
        slots: Object.values(slotsMap),
        inputs,
        noteID: note?.id,
        ...(intent.description && { description: intent.description }),
      },

      note,
    };
  },
  ({ note, intent: legacyIntent }, { creatorID, assistantID, environmentID, legacySlotMap }) => {
    const createdAt = new Date().toJSON();

    const intent: Intent = {
      id: legacyIntent.key,
      name: legacyIntent.name,
      folderID: null,
      createdAt,
      updatedAt: createdAt,
      entityOrder: [],
      description: legacyIntent.description ?? note?.text ?? null,
      assistantID,
      createdByID: creatorID,
      updatedByID: creatorID,
      environmentID,
      automaticReprompt: false,
    };

    const utterances: Utterance[] = legacyIntent.inputs.map((input) => ({
      id: Utils.id.objectID(),
      text: markupToString.toDB(input.text, { entitiesOnly: true }) as UtteranceText,
      intentID: intent.id,
      language: Language.ENGLISH_US,
      updatedAt: createdAt,
      createdAt,
      updatedByID: creatorID,
      assistantID,
      environmentID,
    }));

    const responsesMap: { [responseID: string]: Nullable<Response> } = {};
    const responseVariantsMap: { [responseVariant: string]: Nullable<AnyResponseVariant> } = {};
    const requiredEntitiesMap: { [requiredEntityID: string]: Nullable<RequiredEntity> } = {};
    const responseDiscriminatorsPerResponse: { [responseID: string]: ResponseDiscriminator[] } = {};

    legacyIntent.slots?.forEach((slot) => {
      if (!slot?.required || !legacySlotMap[slot.id]) return;

      const requiredEntity: RequiredEntity = {
        id: Utils.id.objectID(),
        entityID: slot.id,
        intentID: intent.id,
        createdAt,
        updatedAt: createdAt,
        repromptID: null,
        updatedByID: creatorID,
        assistantID,
        environmentID,
      };

      requiredEntitiesMap[requiredEntity.id] = requiredEntity;
      intent.entityOrder.push(requiredEntity.id);

      if (!slot.dialog.prompt.length) return;

      const response: Response = {
        id: Utils.id.objectID(),
        name: "Required Entity's Reprompt",
        folderID: null,
        createdAt,
        updatedAt: createdAt,
        assistantID,
        createdByID: creatorID,
        updatedByID: creatorID,
        environmentID,
      };

      requiredEntity.repromptID = response.id;
      responsesMap[response.id] = response;

      const responseDiscriminator: ResponseDiscriminator = {
        id: Utils.id.objectID(),
        channel: Channel.DEFAULT,
        language: Language.ENGLISH_US,
        createdAt,
        updatedAt: createdAt,
        responseID: response.id,
        updatedByID: creatorID,
        assistantID,
        variantOrder: [],
        environmentID,
      };

      responseDiscriminatorsPerResponse[response.id] = [responseDiscriminator];

      slot.dialog.prompt.forEach((prompt: any) => {
        const responseVariant: TextResponseVariant = {
          id: Utils.id.objectID(),
          type: ResponseVariantType.TEXT,
          text: typeof prompt?.text === 'string' ? markupToString.toDB(prompt.text) : markupToSlate.toDB(prompt?.content),
          speed: null,
          createdAt,
          updatedAt: createdAt,
          cardLayout: CardLayout.CAROUSEL,
          conditionID: null,
          assistantID,
          updatedByID: creatorID,
          environmentID,
          discriminatorID: responseDiscriminator.id,
          attachmentOrder: [],
        };

        responseDiscriminator.variantOrder.push(responseVariant.id);
        responseVariantsMap[responseVariant.id] = responseVariant;
      });
    });

    return {
      intent,
      utterances,
      responsesMap,
      responseVariantsMap,
      requiredEntitiesMap,
      responseDiscriminatorsPerResponse,
    };
  }
);

interface MapFromDBInput {
  intents: Intent[];
  responses: Response[];
  utterances: Utterance[];
  responseVariants: AnyResponseVariant[];
  requiredEntities: RequiredEntity[];
  responseDiscriminators: ResponseDiscriminator[];
}

interface MapFromDBOptions {
  entities: Entity[];
  variables: Variable[];
  isVoiceAssistant: boolean;
}

interface MapFromDBOutput {
  notes: BaseModels.IntentNote[];
  intents: BaseModels.Intent[];
}

interface MapToDBOptions extends Omit<ToDBOptions, 'legacySlotMap'> {
  legacySlots: BaseModels.Slot[];
}

export const intentToLegacyIntent = Object.assign(adapter, {
  mapFromDB: (
    { intents, responses, utterances, responseVariants, requiredEntities, responseDiscriminators }: MapFromDBInput,
    { entities, variables, isVoiceAssistant }: MapFromDBOptions
  ): MapFromDBOutput => {
    const responsesMap = Utils.array.createMap(responses, (response) => response.id);
    const entitiesMapByID = Utils.array.createMap(entities, (entity) => entity.id);
    const variablesMapByID = Utils.array.createMap(variables, (variable) => variable.id);
    const responseVariantsMap = Utils.array.createMap(responseVariants, (responseVariant) => responseVariant.id);
    const requiredEntitiesMap = Utils.array.createMap(requiredEntities, (requiredEntity) => requiredEntity.id);
    const utterancesPerIntent = groupBy(utterances, (utterance) => utterance.intentID);
    const responseDiscriminatorsPerResponse = groupBy(responseDiscriminators, (responseDiscriminator) => responseDiscriminator.responseID);

    return intents.reduce<MapFromDBOutput>(
      (acc, intent) => {
        const result = adapter.fromDB(
          {
            intent,
            utterances: utterancesPerIntent[intent.id] ?? [],
            responsesMap,
            responseVariantsMap,
            requiredEntitiesMap,
            responseDiscriminatorsPerResponse,
          },
          { entitiesMapByID, isVoiceAssistant, variablesMapByID }
        );

        acc.intents.push(result.intent);

        if (result.note) {
          acc.notes.push(result.note);
        }

        return acc;
      },
      { notes: [], intents: [] }
    );
  },

  mapToDB: ({ notes, intents }: MapFromDBOutput, { legacySlots, ...options }: MapToDBOptions): MapFromDBInput => {
    const notesMap = Utils.array.createMap(notes, (note) => note.id);
    const legacySlotMap = Utils.array.createMap(legacySlots, (slot) => slot.key);

    return intents.reduce<MapFromDBInput>(
      (acc, intent) => {
        const result = adapter.toDB({ note: intent.noteID ? notesMap[intent.noteID] ?? null : null, intent }, { ...options, legacySlotMap });

        acc.intents.push(result.intent);
        acc.responses.push(...Object.values(result.responsesMap).filter(Utils.array.isNotNullish));
        acc.utterances.push(...result.utterances);
        acc.responseVariants.push(...Object.values(result.responseVariantsMap).filter(Utils.array.isNotNullish));
        acc.requiredEntities.push(...Object.values(result.requiredEntitiesMap).filter(Utils.array.isNotNullish));
        acc.responseDiscriminators.push(...Object.values(result.responseDiscriminatorsPerResponse).flat().filter(Utils.array.isNotNullish));

        return acc;
      },
      {
        intents: [],
        responses: [],
        utterances: [],
        responseVariants: [],
        requiredEntities: [],
        responseDiscriminators: [],
      }
    );
  },
});
