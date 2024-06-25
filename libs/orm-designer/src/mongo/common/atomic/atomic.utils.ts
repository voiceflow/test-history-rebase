import type { Struct } from '@voiceflow/common';
import { Utils } from '@voiceflow/common';
import type { ArrayOperator, PullAllOperator, PullOperator, PushOperator, SetFields } from 'mongodb-mikro';

import type {
  AddToSetOperation,
  PullAllOperation,
  PullOperation,
  PushOperation,
  SetOperation,
  UnsetOperation,
  UpdateOperation,
} from './atomic.interface';

const combineAtomicPathAndFilters = ({
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

export const Pull = (pulls: PullOperation[]): UpdateOperation<'$pull'> => {
  const query: PullOperator<unknown> = Object.fromEntries(
    pulls.map<[string, unknown]>(({ path, match }) => [path, match])
  );

  return { query, operation: '$pull', arrayFilters: [] };
};

export const PullAll = (pulls: PullAllOperation[]): UpdateOperation<'$pullAll'> => {
  const query: PullAllOperator<unknown> = Object.fromEntries(
    pulls.map<[string, unknown[]]>(({ path, match }) => [path, match])
  );

  return { query, operation: '$pullAll', arrayFilters: [] };
};

export const Push = (pushes: PushOperation[]): UpdateOperation<'$push'> => {
  const query: PushOperator<unknown> = Object.fromEntries(
    pushes
      .map<
        [string, ArrayOperator<unknown[]>]
      >(({ path, value, index }) => [path, { $each: Array.isArray(value) ? value : [value], ...(index != null && { $position: index }) }])
      .filter(([, { $each }]) => $each && $each.length > 0)
  );

  return { query, operation: '$push', arrayFilters: [] };
};

export const Set = (sets: SetOperation[], operationID: string = Utils.id.cuid.slug()): UpdateOperation<'$set'> => {
  const query: Record<string, unknown> = {};
  const arrayFilters: Struct[] = [];

  sets.forEach(({ path, value }, index) => {
    const result = combineAtomicPathAndFilters({ path, index, prefix: 'set', operationID });

    query[result.path] = value;
    arrayFilters.push(...result.filters);
  });

  return { query, operation: '$set', arrayFilters };
};

export const Unset = (
  unsets: UnsetOperation[],
  operationID: string = Utils.id.cuid.slug()
): UpdateOperation<'$unset'> => {
  const query: Record<string, 1> = {};
  const arrayFilters: Struct[] = [];

  unsets.forEach(({ path }, index) => {
    const result = combineAtomicPathAndFilters({ path, index, prefix: 'unset', operationID });

    query[result.path] = 1;
    arrayFilters.push(...result.filters);
  });

  return { query, operation: '$unset', arrayFilters };
};

export const AddToSet = (pushes: AddToSetOperation[]): UpdateOperation<'$addToSet'> => {
  const query: SetFields<unknown> = Object.fromEntries(
    pushes
      .map<
        [string, ArrayOperator<unknown[]>]
      >(({ path, value }) => [path, { $each: Array.isArray(value) ? value : [value] }])
      .filter(([, { $each }]) => $each && $each.length > 0)
  );

  return { query, operation: '$addToSet', arrayFilters: [] };
};
