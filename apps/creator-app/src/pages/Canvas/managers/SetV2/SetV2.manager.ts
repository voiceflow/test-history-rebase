import * as Realtime from '@voiceflow/realtime-sdk';

import * as Documentation from '@/config/documentation';

import { NodeManagerConfigV3 } from '../types';
import { Action, ActionEditor, Editor, Step } from './components';
import { NODE_CONFIG } from './constants';
import { SetV3Editor } from './SetV3Editor/SetV3.editor';
import { SetV3Step } from './SetV3Step/SetV3.step';

export const SetV2Manager: NodeManagerConfigV3<Realtime.NodeData.SetV2, Realtime.NodeData.SetV2BuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Set',

  step: Step,
  action: Action,

  editorV2: Editor,
  editorV3: SetV3Editor,
  editorV3FeatureFlag: Realtime.FeatureFlag.V3_SET_STEP,
  actionEditor: ActionEditor,

  tooltipText: 'Sets and changes the value of variables.',
  tooltipLink: Documentation.SET_STEP,
  featureFlagOverrides: {
    step: SetV3Step,
  },
};
