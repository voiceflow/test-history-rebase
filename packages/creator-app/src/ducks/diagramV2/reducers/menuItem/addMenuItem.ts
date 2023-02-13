import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from '../utils';

const addMenuItemReducer = createReducer(Realtime.diagram.addMenuItem, (state, { type, diagramID, sourceID }) => {
  const diagram = Normal.getOne(state, diagramID);

  if (!diagram) return;

  diagram.menuItems.push({ type, sourceID });
});

export default addMenuItemReducer;
