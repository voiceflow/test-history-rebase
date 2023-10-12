import { openURLAction } from '../../action/open-url/open-url.action.fixture';
import { NodeType } from '../node-type.enum';
import type { ActionsNode } from './actions.node';

export const actionsNode: ActionsNode = {
  id: 'actions-node-1',
  type: NodeType.ACTIONS__V3,

  data: {
    actionIDs: [openURLAction.id],
  },
};
