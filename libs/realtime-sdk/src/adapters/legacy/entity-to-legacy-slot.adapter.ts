import type { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import { Entity, EntityVariant, Language } from '@voiceflow/dtos';
import { createSimpleAdapter } from 'bidirectional-adapter';
import groupBy from 'lodash/groupBy';

interface Input {
  entity: Entity;
  entityVariants: EntityVariant[];
}

interface ToDBOptions {
  creatorID: number;
  assistantID: string;
  environmentID: string;
}

const createEntityVariant =
  ({ entityID, creatorID, assistantID, environmentID }: { entityID: string } & ToDBOptions) =>
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
      updatedByID: creatorID,
      assistantID,
      environmentID,
    };
  };

const adapter = createSimpleAdapter<Input, BaseModels.Slot, [], [ToDBOptions]>(
  ({ entity, entityVariants }) => ({
    key: entity.id,
    name: entity.name,
    color: entity.color,
    inputs: entityVariants.map((variant) => [variant.value, ...variant.synonyms].join(',')),

    // TODO: convert classifier?
    type: { value: entity.classifier ?? undefined },
  }),
  (slot, { creatorID, assistantID, environmentID }) => ({
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
      environmentID,

      // TODO: add a default color
      color: slot.color ?? '',
      // TODO: convert type?
      classifier: slot.type.value ?? null,
    },

    entityVariants: slot.inputs.map(createEntityVariant({ entityID: slot.key, creatorID, assistantID, environmentID })),
  })
);

interface MapInput {
  entities: Entity[];
  entityVariants: EntityVariant[];
}

export const entityToLegacySlot = Object.assign(adapter, {
  mapFromDB: ({ entities, entityVariants }: MapInput): BaseModels.Slot[] => {
    const variantsPerEntity = groupBy(entityVariants, (variant) => variant.entityID);

    return entities.map((entity) => adapter.fromDB({ entity, entityVariants: variantsPerEntity[entity.id] ?? [] }));
  },

  mapToDB: (slots: BaseModels.Slot[], options: ToDBOptions): MapInput =>
    slots.reduce<MapInput>(
      (acc, slot) => {
        const result = adapter.toDB(slot, options);

        acc.entities.push(result.entity);
        acc.entityVariants.push(...result.entityVariants);

        return acc;
      },
      { entities: [], entityVariants: [] }
    ),
});
