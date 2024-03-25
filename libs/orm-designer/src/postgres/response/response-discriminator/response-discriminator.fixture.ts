import type { EntityDTO } from '@mikro-orm/core';
import { Channel, Language } from '@voiceflow/dtos';

import type { ResponseDiscriminatorEntity } from './response-discriminator.entity';

export const responseDiscriminator: EntityDTO<ResponseDiscriminatorEntity> = {
  id: 'response-discriminator-1',
  createdAt: new Date(),
  updatedAt: new Date(),
  updatedBy: { id: 1 } as any,
  language: Language.ENGLISH_US,
  channel: Channel.DEFAULT,
  variantOrder: ['response-variant-1', 'response-variant-2'],
  response: { id: 'response-1' } as any,
  assistant: { id: 'assistant-1' } as any,
  environmentID: 'environment-1',
};

export const responseDiscriminatorList: EntityDTO<ResponseDiscriminatorEntity>[] = [
  responseDiscriminator,
  {
    ...responseDiscriminator,
    id: 'response-discriminator-2',
  },
];
