import { DiagramState } from '@/constants';
import * as CRUD from '@/ducks/utils/crud';

import { DiagramState as DiagramStateType } from './types';

export const DIAGRAM_STATE_KEY = 'diagram';

export const INITIAL_DIAGRAM_STATE: DiagramStateType = {
  diagramID: null,
  rootNodeIDs: [],
  nodes: CRUD.INITIAL_STATE,
  links: CRUD.INITIAL_STATE,
  ports: CRUD.INITIAL_STATE,
  data: {},
  linksByPortID: {},
  linksByNodeID: {},
  linkedNodesByNodeID: {},
  sections: {},
  markupNodeIDs: [],
  diagramState: DiagramState.IDLE,
  hidden: false,
};
