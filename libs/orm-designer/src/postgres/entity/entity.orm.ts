import { PostgresCMSTabularORM } from '../common';
import { EntityEntity } from './entity.entity';

export class EntityORM extends PostgresCMSTabularORM(EntityEntity) {}
