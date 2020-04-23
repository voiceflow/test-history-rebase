import { DiagramAction } from '@/ducks/creator';
import { AnyAction } from '@/store/types';
import { filterEntries } from '@/utils/objects';

import { LockType, ServerAction } from './constants';
import { RealtimeLocks } from './types';

export const createServerAction = (action: AnyAction): { type: ServerAction; targets: string[] } | null => {
  switch (action.type) {
    case DiagramAction.REMOVE_NODE:
      return {
        type: ServerAction.DELETE_BLOCK,
        targets: [action.payload],
      };
    case DiagramAction.REMOVE_MANY_NODES:
      return {
        type: ServerAction.DELETE_BLOCK,
        targets: action.payload,
      };
    default:
      return null;
  }
};

export const removeSelfFromLocks = ({ blocks, resources, users }: WithOptional<RealtimeLocks, 'users'>, tabID: string) => {
  const filterByValue = (_: any, value: string) => value !== tabID;

  return {
    blocks: Object.entries(blocks).reduce(
      (acc, [key, value]) => Object.assign(acc, { [key]: filterEntries(value, filterByValue) }),
      {} as Record<LockType.MOVEMENT | LockType.EDIT, Record<string, string>>
    ),
    resources: filterEntries(resources, filterByValue),
    users,
  };
};
