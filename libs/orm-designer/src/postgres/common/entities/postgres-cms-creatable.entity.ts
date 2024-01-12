import type { EntityCreateParams } from '@/types';

import { CreatedAt } from '../decorators/created-at.decorator';
import { PostgresCMSEntity } from './postgres-cms.entity';

export abstract class PostgresCMSCreatableEntity extends PostgresCMSEntity {
  @CreatedAt()
  createdAt: Date;

  constructor({ createdAt = new Date().toJSON(), ...data }: EntityCreateParams<PostgresCMSCreatableEntity>) {
    super(data);

    this.createdAt = new Date(createdAt);
  }
}
