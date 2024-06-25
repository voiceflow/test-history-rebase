import { RequestContext } from '@mikro-orm/core';
import { MongoEntityManager } from '@mikro-orm/mongodb';
import { getEntityManagerToken } from '@mikro-orm/nestjs';
import { SqlEntityManager } from '@mikro-orm/postgresql';
import { Inject } from '@nestjs/common';
import { DatabaseTarget } from '@voiceflow/orm-designer';

const MONGO_FILED_NAME = Symbol(DatabaseTarget.MONGO);
const POSTGRES_FILED_NAME = Symbol(DatabaseTarget.POSTGRES);

export const InjectRequestContext = (): ClassDecorator =>
  (<T extends { new (...args: any[]): any }>(Target: T) => {
    class DecoratedTarget extends Target {
      @Inject(getEntityManagerToken(DatabaseTarget.MONGO)) protected [MONGO_FILED_NAME]!: MongoEntityManager;

      @Inject(getEntityManagerToken(DatabaseTarget.POSTGRES)) protected [POSTGRES_FILED_NAME]!: SqlEntityManager;
    }

    Object.defineProperty(DecoratedTarget, 'name', { value: `InjectRequest(${Target.name})` });

    return DecoratedTarget;
  }) as ClassDecorator;

export const UseRequestContext = (): MethodDecorator =>
  function (_target: any, _propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;

    // eslint-disable-next-line no-param-reassign
    descriptor.value = async function (this, ...args: any[]) {
      const mongoEM = (this as any)[MONGO_FILED_NAME] as MongoEntityManager | undefined;
      const postgresEM = (this as any)[POSTGRES_FILED_NAME] as SqlEntityManager | undefined;

      if (!mongoEM || !postgresEM) {
        throw new Error('Request context ORMs not found, please use InjectRequestContext decorator to inject ORMs');
      }

      return RequestContext.createAsync([mongoEM, postgresEM], async () => originalMethod.apply(this, args));
    };

    return descriptor;
  };
