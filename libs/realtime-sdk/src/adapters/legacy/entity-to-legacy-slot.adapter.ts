import type { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { Entity, EntityVariant, Language } from '@voiceflow/sdk-logux-designer';
import { createSimpleAdapter } from 'bidirectional-adapter';
import groupBy from 'lodash/groupBy';

interface Input {
  entity: Entity;
  variants: EntityVariant[];
}

interface ToDBOptions {
  creatorID: number;
  assistantID: string;
}

const createEntityVariant =
  ({ entityID, assistantID }: { entityID: string } & ToDBOptions) =>
  (input: string): EntityVariant => {
    const [value = '', ...synonyms] = input.split(',');

    return {
      id: Utils.id.objectID(),
      value,
      entityID,
      language: Language.ENGLISH_US,
      synonyms,
      createdAt: new Date().toJSON(),
      updatedAt: new Date().toJSON(),
      assistantID,
    };
  };

const adapter = createSimpleAdapter<Input, BaseModels.Slot, [], [ToDBOptions]>(
  ({ entity, variants }) => ({
    key: entity.id,
    name: entity.name,
    color: entity.color,
    inputs: variants.map((variant) => [variant.value, ...variant.synonyms].join(',')),

    // TODO: convert classifier?
    type: { value: entity.classifier ?? undefined },
  }),
  (slot, { creatorID, assistantID }) => ({
    entity: {
      id: slot.key,
      name: slot.name,
      isArray: false,
      folderID: null,
      createdAt: new Date().toJSON(),
      updatedAt: new Date().toJSON(),
      createdByID: creatorID,
      assistantID,
      updatedByID: creatorID,
      description: null,

      // TODO: add a default color
      color: slot.color ?? '',
      // TODO: convert type?
      classifier: slot.type.value ?? null,
    },

    variants: slot.inputs.map(createEntityVariant({ entityID: slot.key, creatorID, assistantID })),
  })
);

export const entityToLegacySlot = Object.assign(adapter, {
  mapFromDB: (entities: Entity[], variants: EntityVariant[]): BaseModels.Slot[] => {
    const variantsPerEntity = groupBy(variants, (variant) => variant.entityID);

    return entities.map((entity) => adapter.fromDB({ entity, variants: variantsPerEntity[entity.id] ?? [] }));
  },

  mapToDB: (slots: BaseModels.Slot[], options: ToDBOptions): Input[] => slots.map((slot) => adapter.toDB(slot, options)),
});
