import type { Primary } from '@mikro-orm/core';
import { NotFoundException } from '@voiceflow/exception';
import type { CreateData, ORM, ORMDiscriminatorEntity, ORMEntity } from '@voiceflow/orm-designer';

export abstract class BaseService<Orm extends ORM<any, any>> {
  protected abstract readonly orm: ORM<ORMEntity<Orm>, ORMDiscriminatorEntity<Orm>>;

  createOne(data: CreateData<ORMDiscriminatorEntity<Orm>>) {
    return this.orm.createOne(data);
  }

  createMany(data: CreateData<ORMDiscriminatorEntity<Orm>>[]) {
    return this.orm.createMany(data);
  }

  findOne(id: Primary<ORMEntity<Orm>>) {
    return this.orm.findOne(id);
  }

  findMany(ids: Primary<ORMEntity<Orm>>[]) {
    return this.orm.findMany(ids);
  }

  async findOneOrFail(id: Primary<ORMEntity<Orm>>) {
    try {
      return await this.orm.findOneOrFail(id);
    } catch (err) {
      const entityName = this.orm.Entity.name.replace('Entity', '');

      if (typeof id === 'string') {
        throw new NotFoundException(`Failed to find ${entityName} with ID ${id}`);
      } else {
        throw new NotFoundException(`Failed to find ${entityName} with ${JSON.stringify(id)}`);
      }
    }
  }
}
