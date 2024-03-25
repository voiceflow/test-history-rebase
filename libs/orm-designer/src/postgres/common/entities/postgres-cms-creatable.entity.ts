import type { ToJSON, ToObject } from '@/types';

import { CreatedAt } from '../decorators/created-at.decorator';
import { PostgresCMSEntity } from './postgres-cms.entity';

export abstract class PostgresCMSCreatableEntity<DefaultOrNullColumn extends string = never> extends PostgresCMSEntity<
  DefaultOrNullColumn | 'createdAt'
> {
  @CreatedAt()
  createdAt!: Date;
}

export type PostgresCMSCreatableObject = ToObject<PostgresCMSCreatableEntity>;
export type PostgresCMSCreatableJSON = ToJSON<PostgresCMSCreatableObject>;
