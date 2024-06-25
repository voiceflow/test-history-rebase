import * as Atomic from './atomic';

class AtomicEntity {
  constructor(private pathGetter: (entityID: string, path?: string) => string) {}

  private runMany<T extends { entityID: string }, K extends Atomic.UpdateOperationType>(
    entities: T[],
    fn: (entity: T) => Atomic.UpdateOperation<K>
  ): Atomic.UpdateOperation<K> {
    return entities.reduce(
      (acc, entity) => {
        const result = fn(entity);

        return {
          ...acc,
          query: { ...acc.query, ...result.query },
          operation: result.operation,
          arrayFilters: [...acc.arrayFilters, ...result.arrayFilters],
        };
      },
      { query: {}, operation: '' as K, arrayFilters: [] } as Atomic.UpdateOperation<K>
    );
  }

  public pull(entityID: string, pulls: Atomic.PullOperation[]): Atomic.UpdateOperation<'$pull'> {
    return Atomic.pull(pulls.map(({ path, ...data }) => ({ ...data, path: this.pathGetter(entityID, path) })));
  }

  public pullMany(
    entityPulls: Array<{ entityID: string; pulls: Atomic.PullOperation[] }>
  ): Atomic.UpdateOperation<'$pull'> {
    return this.runMany(entityPulls, ({ entityID, pulls }) => this.pull(entityID, pulls));
  }

  public push(entityID: string, pushes: Atomic.PushOperation[]): Atomic.UpdateOperation<'$push'> {
    return Atomic.push(pushes.map(({ path, ...data }) => ({ ...data, path: this.pathGetter(entityID, path) })));
  }

  public pushMany(
    entityPushes: Array<{ entityID: string; pushes: Atomic.PushOperation[] }>
  ): Atomic.UpdateOperation<'$push'> {
    return this.runMany(entityPushes, ({ entityID, pushes }) => this.push(entityID, pushes));
  }

  public set(entityID: string, sets: Atomic.SetOperation[]): Atomic.UpdateOperation<'$set'> {
    return Atomic.set(
      sets.map(({ path, ...data }) => ({
        ...data,
        path: typeof path === 'string' ? this.pathGetter(entityID, path) : [this.pathGetter(entityID), ...path],
      }))
    );
  }

  public setMany(entitySets: Array<{ entityID: string; sets: Atomic.SetOperation[] }>): Atomic.UpdateOperation<'$set'> {
    return this.runMany(entitySets, ({ entityID, sets }) => this.set(entityID, sets));
  }

  public unset(entityID: string, unsets: Atomic.UnsetOperation[]): Atomic.UpdateOperation<'$unset'> {
    return Atomic.unset(
      unsets.map(({ path, ...data }) => ({
        ...data,
        path: typeof path === 'string' ? this.pathGetter(entityID, path) : [this.pathGetter(entityID), ...path],
      }))
    );
  }

  public unsetMany(
    entityUnsets: Array<{ entityID: string; unsets: Atomic.UnsetOperation[] }>
  ): Atomic.UpdateOperation<'$unset'> {
    return this.runMany(entityUnsets, ({ entityID, unsets }) => this.unset(entityID, unsets));
  }
}

export default AtomicEntity;
