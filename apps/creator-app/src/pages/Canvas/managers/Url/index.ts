import * as Realtime from '@voiceflow/realtime-sdk';

import { NodeManagerConfigV2 } from '../types';
import { Action, ActionEditor, Editor, Step } from './components';
import { NODE_CONFIG } from './constants';

const UrlManager: NodeManagerConfigV2<Realtime.NodeData.Url, Realtime.NodeData.UrlBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Url',

  step: Step,
  action: Action,
  editorV2: Editor,
  actionEditor: ActionEditor,
};

export default UrlManager;
