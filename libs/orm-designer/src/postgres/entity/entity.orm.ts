import { PostgresCMSTabularORM } from '../common';
import { EntityEntity } from './entity.entity';
import { EntityJSONAdapter } from './entity-json.adapter';

export class EntityORM extends PostgresCMSTabularORM<EntityEntity> {
  Entity = EntityEntity;

  jsonAdapter = EntityJSONAdapter;
}
