import * as Realtime from '@voiceflow/realtime-sdk';

import * as Documentation from '@/config/documentation';

import { NodeManagerConfigV3 } from '../types';
import { ComponentEditor } from './ComponentEditor/Component.editor';
import { NODE_CONFIG } from './ComponentManager.constants';
import ComponentStep from './ComponentStep/Component.step';
import { Action, ActionEditor } from './legacy/components';

export const ComponentManager: NodeManagerConfigV3<Realtime.NodeData.Component, Realtime.NodeData.ComponentBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Component',

  step: ComponentStep,
  action: Action,

  editorV3: ComponentEditor,

  actionEditor: ActionEditor,

  tooltipText: 'Points the conversation to an existing Component.',
  tooltipLink: Documentation.COMPONENT_STEP,
};
