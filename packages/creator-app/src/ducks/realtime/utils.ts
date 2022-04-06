import { Utils, WithOptional } from '@voiceflow/common';

import { DiagramAction } from '@/ducks/creator/diagram/actions';
import { AnyAction } from '@/store/types';

import { LockType, ServerAction } from './constants';
import { RealtimeLocks } from './types';

export const createServerAction = (action: AnyAction): { type: ServerAction; targets: string[] } | null => {
  if (action.type === DiagramAction.REMOVE_MANY_NODES) {
    return {
      type: ServerAction.DELETE_BLOCK,
      targets: action.payload,
    };
  }

  return null;
};

export const removeSelfFromLocks = ({ blocks, users }: WithOptional<RealtimeLocks, 'users'>, tabID: string): WithOptional<RealtimeLocks, 'users'> => {
  return {
    blocks: Object.entries(blocks).reduce(
      (acc, [key, value]) => Object.assign(acc, { [key]: Utils.object.pickBy(value, (_, value) => value !== tabID) }),
      {} as Record<LockType.MOVEMENT | LockType.EDIT, Record<string, string>>
    ),
    users,
  };
};
