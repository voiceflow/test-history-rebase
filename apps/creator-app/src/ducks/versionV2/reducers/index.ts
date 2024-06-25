import type { VersionSettings } from '@voiceflow/dtos';
import { Actions } from '@voiceflow/sdk-logux-designer';
import * as Normal from 'normal-store';

import { createRootCRUDReducer } from '@/ducks/utils/crudV2';

import { INITIAL_STATE } from '../constants';
import addDiagram from './addDiagram';
import crudReducers from './crud';
import patchDefaultStepColors from './patchDefaultStepColors';
import patchPublishing from './patchPublishing';
import patchSession from './patchSession';
import patchSettings from './patchSettings';

const versionReducer = createRootCRUDReducer(INITIAL_STATE, crudReducers)
  .immerCase(...addDiagram)
  .immerCase(...patchPublishing)
  .immerCase(...patchSession)
  .immerCase(...patchSettings)
  .immerCase(...patchDefaultStepColors)
  .case(Actions.Version.UpdateSettings, (state, { context, settings }) =>
    Normal.patchOne(state, context.environmentID, {
      settingsV2: { ...Normal.getOne(state, context.environmentID)?.settingsV2, ...settings } as VersionSettings,
    })
  )
  .build();

export default versionReducer;
