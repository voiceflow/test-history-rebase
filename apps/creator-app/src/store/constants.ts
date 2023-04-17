import { allReverters } from '@/ducks';

import { InvalidatorLookup, ReverterLookup } from './types';

export const ACTION_REVERTERS = allReverters.reduce<ReverterLookup>((acc, reverter) => {
  const { type } = reverter.actionCreator;

  acc[type] ??= [];
  acc[type]?.push(reverter);

  return acc;
}, {});

export const ACTION_INVALIDATORS = allReverters.reduce<InvalidatorLookup>((acc, reverter) => {
  const { type: revertType } = reverter.actionCreator;

  reverter.invalidators.forEach((invalidator) => {
    const { type: invalidateType } = invalidator.actionCreator;

    acc[invalidateType] ??= {};
    const invalidators = acc[invalidateType]!;

    invalidators[revertType] ??= [];
    invalidators[revertType]?.push(invalidator);
  });

  return acc;
}, {});
