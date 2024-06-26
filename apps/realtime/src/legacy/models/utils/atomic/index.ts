import type { Struct } from '@voiceflow/common';
import { Utils } from '@voiceflow/common';
import type { ArrayOperator, PullOperator, PushOperator } from 'mongodb';

import type { PullOperation, PushOperation, SetOperation, UnsetOperation, UpdateOperation } from './scheme';

export * from './scheme';

const combinePathAndFilters = ({
  path,
  index,
  prefix,
  operationID,
}: {
  path: string | Array<string | Struct>;
  index: number;
  prefix: string;
  operationID: string;
}): { path: string; filters: Struct[] } => {
  if (typeof path === 'string') {
    return { path, filters: [] };
  }

  const arrayFilters: Struct[] = [];
  const combinedPath: string[] = [];

  path.forEach((fragment, fragmentIndex) => {
    if (typeof fragment === 'string') {
      combinedPath.push(fragment);
    } else {
      const filterName = `${prefix}${operationID}${index}${fragmentIndex}${Utils.id.cuid.slug()}`
        .toLowerCase()
        .replace(/[^\da-z]/gi, '');

      combinedPath.push(`$[${filterName}]`);
      arrayFilters.push(
        Object.fromEntries(Object.entries(fragment).map(([key, value]) => [`${filterName}.${key}`, value]))
      );
    }
  });

  return { path: combinedPath.join('.'), filters: arrayFilters };
};

export const pull = (pulls: PullOperation[]): UpdateOperation<'$pull'> => {
  const query: PullOperator<unknown> = Object.fromEntries(
    pulls.map<[string, unknown]>(({ path, match }) => [path, match])
  );

  return { query, operation: '$pull', arrayFilters: [] };
};

export const push = (pushes: PushOperation[]): UpdateOperation<'$push'> => {
  const query: PushOperator<unknown> = Object.fromEntries(
    pushes
      .map<
        [string, ArrayOperator<unknown[]>]
      >(({ path, value, index }) => [path, { $each: Array.isArray(value) ? value : [value], ...(index != null && { $position: index }) }])
      .filter(([, { $each }]) => ($each?.length || 0) > 0)
  );

  return { query, operation: '$push', arrayFilters: [] };
};

export const set = (sets: SetOperation[], operationID: string = Utils.id.cuid.slug()): UpdateOperation<'$set'> => {
  const query: Record<string, unknown> = {};
  const arrayFilters: Struct[] = [];

  sets.forEach(({ path, value }, index) => {
    const result = combinePathAndFilters({ path, index, prefix: 'set', operationID });

    query[result.path] = value;
    arrayFilters.push(...result.filters);
  });

  return { query, operation: '$set', arrayFilters };
};

export const unset = (
  unsets: UnsetOperation[],
  operationID: string = Utils.id.cuid.slug()
): UpdateOperation<'$unset'> => {
  const query: Record<string, 1> = {};
  const arrayFilters: Struct[] = [];

  unsets.forEach(({ path }, index) => {
    const result = combinePathAndFilters({ path, index, prefix: 'unset', operationID });

    query[result.path] = 1;
    arrayFilters.push(...result.filters);
  });

  return { query, operation: '$unset', arrayFilters };
};
