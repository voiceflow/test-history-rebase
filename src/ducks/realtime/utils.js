import * as Creator from '@/ducks/creator';

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
