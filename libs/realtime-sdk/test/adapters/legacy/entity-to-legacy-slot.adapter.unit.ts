import { entityToLegacySlot } from '@realtime-sdk/adapters/legacy/entity-to-legacy-slot.adapter';
import type { BaseModels } from '@voiceflow/base-types';
import { Utils } from '@voiceflow/common';
import type { EntityEntity, EntityVariantEntity, ToJSONWithForeignKeys } from '@voiceflow/orm-designer';
import { Language } from '@voiceflow/orm-designer';

describe('Adapters | Legacy | entityToLegacySlot', () => {
  const creatorID = 1;
  const createdAt = '2021-01-01T00:00:00.000Z';
  const assistantID = 'assistant-id';
  const environmentID = 'environment-id';

  const entity1: ToJSONWithForeignKeys<EntityEntity> = {
    id: 'entity-1',
    name: 'entity-1',
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

  const slot1: BaseModels.Slot = {
    key: 'entity-1',
    name: 'entity-1',
    type: { value: 'classifier-1' },
    color: '#000',
    inputs: ['variant-1,variant-1-synonym-1,variant-1-synonym-2', 'variant-2,variant-2-synonym-1,variant-2-synonym-2'],
  };

  const entity2: ToJSONWithForeignKeys<EntityEntity> = {
    ...entity1,
    id: 'entity-2',
    name: 'entity-2',
    color: '#515151',
    classifier: null,
  };

  const slot2: BaseModels.Slot = {
    key: 'entity-2',
    name: 'entity-2',
    type: { value: undefined },
    color: '#515151',
    inputs: ['variant-3,variant-3-synonym-1,variant-3-synonym-2', 'variant-4,variant-4-synonym-1,variant-4-synonym-2'],
  };

  const variant1: ToJSONWithForeignKeys<EntityVariantEntity> = {
    id: `${entity1.id}-variant-1'`,
    value: 'variant-1',
    entityID: entity1.id,
    synonyms: ['variant-1-synonym-1', 'variant-1-synonym-2'],
    language: Language.ENGLISH_US,
    createdAt,
    updatedAt: createdAt,
    assistantID,
    environmentID,
  };

  const variant2: ToJSONWithForeignKeys<EntityVariantEntity> = {
    ...variant1,
    id: `${entity1.id}-variant-2'`,
    value: 'variant-2',
    synonyms: ['variant-2-synonym-1', 'variant-2-synonym-2'],
  };

  const variant3: ToJSONWithForeignKeys<EntityVariantEntity> = {
    ...variant1,
    id: `${entity2.id}-variant-1'`,
    value: 'variant-3',
    entityID: entity2.id,
    synonyms: ['variant-3-synonym-1', 'variant-3-synonym-2'],
  };

  const variant4: ToJSONWithForeignKeys<EntityVariantEntity> = {
    ...variant1,
    id: `${entity2.id}-variant-2'`,
    value: 'variant-4',
    entityID: entity2.id,
    synonyms: ['variant-4-synonym-1', 'variant-4-synonym-2'],
  };

  beforeEach(() => {
    vi.useFakeTimers();

    vi.setSystemTime(new Date(createdAt));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('fromDB', () => {
    it('returns correct data', () => {
      expect(entityToLegacySlot.fromDB({ entity: entity1, variants: [variant1, variant2] })).toEqual(slot1);
      expect(entityToLegacySlot.fromDB({ entity: entity2, variants: [variant3, variant4] })).toEqual(slot2);
    });
  });

  describe('mapFromDB', () => {
    it('returns correct data', () => {
      expect(entityToLegacySlot.mapFromDB([entity1, entity2], [variant1, variant3, variant4, variant2])).toEqual([slot1, slot2]);
    });
  });

  describe('toDB', () => {
    it('returns correct data', () => {
      vi.spyOn(Utils.id, 'objectID').mockReturnValueOnce(variant1.id).mockReturnValueOnce(variant2.id);

      expect(entityToLegacySlot.toDB(slot1, { creatorID, assistantID, environmentID })).toEqual({ entity: entity1, variants: [variant1, variant2] });
    });
  });

  describe('mapToDB', () => {
    it('returns correct data', () => {
      vi.spyOn(Utils.id, 'objectID')
        .mockReturnValueOnce(variant1.id)
        .mockReturnValueOnce(variant2.id)
        .mockReturnValueOnce(variant3.id)
        .mockReturnValueOnce(variant4.id);

      expect(entityToLegacySlot.mapToDB([slot1, slot2], { creatorID, assistantID, environmentID })).toEqual([
        { entity: entity1, variants: [variant1, variant2] },
        { entity: entity2, variants: [variant3, variant4] },
      ]);
    });
  });
});
