import * as Realtime from '@voiceflow/realtime-sdk';
import * as Normal from 'normal-store';

import { createReducer } from './utils';

const addManyComponents = createReducer(Realtime.version.addManyComponents, (state, { versionID, components }) => {
  const version = Normal.getOne(state, versionID);

  if (!version) return;

  version.components.push(...components);
});

export default addManyComponents;
