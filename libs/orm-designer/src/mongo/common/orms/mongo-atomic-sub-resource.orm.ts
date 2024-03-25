import type { DynamicModule } from '@nestjs/common';
import { Inject, Injectable, Module } from '@nestjs/common';

import type { Constructor } from '@/types';

import type { MongoAtomicORM } from './mongo-atomic.orm';

export const MongoAtomicSubResourceORM = <Orm extends MongoAtomicORM<any>>(
  ORM: Constructor<Orm> & { register: () => DynamicModule }
) => {
  @Injectable()
  @Module({})
  class MongoAtomicSubResourceORMClass {
    static register(): DynamicModule {
      return {
        module: this,
        imports: [ORM],
        exports: [this],
      };
    }

    readonly orm: Orm;

    constructor(@Inject(ORM) orm?: Orm) {
      this.orm = orm!;
    }
  }

  return MongoAtomicSubResourceORMClass;
};
