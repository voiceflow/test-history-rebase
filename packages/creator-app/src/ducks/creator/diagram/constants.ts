import { DiagramState } from '@/constants';
import { createCRUDState } from '@/ducks/utils/crud';

import { DiagramState as DiagramStateType } from './types';

export const DIAGRAM_STATE_KEY = 'diagram';

export const INITIAL_DIAGRAM_STATE: DiagramStateType = {
  diagramID: null,
  rootNodeIDs: [],
  nodes: createCRUDState(),
  links: createCRUDState(),
  ports: createCRUDState(),
  data: {},
  linksByPortID: {},
  linksByNodeID: {},
  linkedNodesByNodeID: {},
  sections: {},
  markupNodeIDs: [],
  diagramState: DiagramState.IDLE,
  hidden: false,
};
