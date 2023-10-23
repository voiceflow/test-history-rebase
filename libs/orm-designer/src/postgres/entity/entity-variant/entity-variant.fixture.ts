import type { EntityDTO } from '@mikro-orm/core';

import { Language } from '@/common/enums/language.enum';

import type { EntityVariantEntity } from './entity-variant.entity';

export const entityVariant: EntityDTO<EntityVariantEntity> = {
  id: 'entity-variant-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  language: Language.ENGLISH_US,
  value: 'car',
  synonyms: ['vehicle', 'sedan', 'automobile'],
  entity: { id: 'entity-id' } as any,
  assistant: { id: 'assistant-id' } as any,
  environmentID: 'environment-1',
};

export const entityVariantList: EntityDTO<EntityVariantEntity>[] = [
  entityVariant,
  {
    ...entityVariant,
    id: 'entity-variant-2',
    value: 'hat',
    synonyms: ['cap', 'fedora', 'beanie'],
  },
];
