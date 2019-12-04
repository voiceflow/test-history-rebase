import * as Creator from '@/ducks/creator';
import { filterEntries } from '@/utils/objects';

import { ServerAction } from './constants';

export const createServerAction = (action) => {
  switch (action.type) {
    case Creator.REMOVE_NODE:
      return {
        type: ServerAction.DELETE_BLOCK,
        targets: [action.payload],
      };
    case Creator.REMOVE_MANY_NODES:
      return {
        type: ServerAction.DELETE_BLOCK,
        targets: action.payload,
      };
    default:
      return null;
  }
};

export const removeSelfFromLocks = ({ blocks, resources, users }, tabID) => {
  const filterByValue = (_, value) => value !== tabID;

  return {
    blocks: Object.entries(blocks).reduce((acc, [key, value]) => Object.assign(acc, { [key]: filterEntries(value, filterByValue) }), {}),
    resources: filterEntries(resources, filterByValue),
    users,
  };
};
