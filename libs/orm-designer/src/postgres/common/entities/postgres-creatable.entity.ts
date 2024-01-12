import { CreatedAt } from '../decorators/created-at.decorator';
import { PostgresMutableEntity } from './postgres-mutable.entity';

export abstract class PostgresCreatableEntity extends PostgresMutableEntity {
  @CreatedAt({ type: 'timestamptz' })
  createdAt: Date = new Date();
}
