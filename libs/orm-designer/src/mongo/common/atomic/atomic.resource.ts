import type {
  PullOperation,
  PushOperation,
  SetOperation,
  UnsetOperation,
  UpdateOperation,
  UpdateOperationType,
} from './atomic.interface';
import { Pull, Push, Set, Unset } from './atomic.utils';

export class Resource {
  constructor(private pathGetter: (resourceID: string, path?: string) => string) {}

  private runMany<T extends { resourceID: string }, K extends UpdateOperationType>(
    resources: T[],
    fn: (resource: T) => UpdateOperation<K>
  ): UpdateOperation<K> {
    return resources.reduce(
      (acc, resource) => {
        const result = fn(resource);

        return {
          ...acc,
          query: { ...acc.query, ...result.query },
          operation: result.operation,
          arrayFilters: [...acc.arrayFilters, ...result.arrayFilters],
        };
      },
      { query: {}, operation: '' as K, arrayFilters: [] } as UpdateOperation<K>
    );
  }

  public pull(resourceID: string, pulls: PullOperation[]): UpdateOperation<'$pull'> {
    return Pull(pulls.map(({ path, ...data }) => ({ ...data, path: this.pathGetter(resourceID, path) })));
  }

  public pullMany(entityPulls: Array<{ resourceID: string; pulls: PullOperation[] }>): UpdateOperation<'$pull'> {
    return this.runMany(entityPulls, ({ resourceID, pulls }) => this.pull(resourceID, pulls));
  }

  public push(resourceID: string, pushes: PushOperation[]): UpdateOperation<'$push'> {
    return Push(pushes.map(({ path, ...data }) => ({ ...data, path: this.pathGetter(resourceID, path) })));
  }

  public pushMany(entityPushes: Array<{ resourceID: string; pushes: PushOperation[] }>): UpdateOperation<'$push'> {
    return this.runMany(entityPushes, ({ resourceID, pushes }) => this.push(resourceID, pushes));
  }

  public set(resourceID: string, sets: SetOperation[]): UpdateOperation<'$set'> {
    return Set(
      sets.map(({ path, ...data }) => ({
        ...data,
        path: typeof path === 'string' ? this.pathGetter(resourceID, path) : [this.pathGetter(resourceID), ...path],
      }))
    );
  }

  public setMany(entitySets: Array<{ resourceID: string; sets: SetOperation[] }>): UpdateOperation<'$set'> {
    return this.runMany(entitySets, ({ resourceID, sets }) => this.set(resourceID, sets));
  }

  public unset(resourceID: string, unsets: UnsetOperation[]): UpdateOperation<'$unset'> {
    return Unset(
      unsets.map(({ path, ...data }) => ({
        ...data,
        path: typeof path === 'string' ? this.pathGetter(resourceID, path) : [this.pathGetter(resourceID), ...path],
      }))
    );
  }

  public unsetMany(entityUnsets: Array<{ resourceID: string; unsets: UnsetOperation[] }>): UpdateOperation<'$unset'> {
    return this.runMany(entityUnsets, ({ resourceID, unsets }) => this.unset(resourceID, unsets));
  }
}
