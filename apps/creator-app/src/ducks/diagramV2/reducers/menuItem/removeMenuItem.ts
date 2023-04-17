import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from '../utils';

const removeMenuItemReducer = createReducer(Realtime.diagram.removeMenuItem, (state, { diagramID, sourceID }) => {
  const diagram = Normal.getOne(state, diagramID);

  if (!diagram) return;

  diagram.menuItems = diagram.menuItems.filter((item) => item.sourceID !== sourceID);
});

export default removeMenuItemReducer;
