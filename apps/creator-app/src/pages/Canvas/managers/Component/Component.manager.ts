import * as Realtime from '@voiceflow/realtime-sdk';

import * as Documentation from '@/config/documentation';

import { NodeManagerConfigV3 } from '../types';
import { ComponentEditor } from './ComponentEditor/Component.editor';
import { NODE_CONFIG } from './ComponentManager.constants';
import { TemporaryVersionSwitch } from './ComponentStep/TemporaryVersionSwitch.step';
import { Action, ActionEditor } from './legacy/components';
import LegacyComponentEditor from './legacy/components/Editor';

export const ComponentManager: NodeManagerConfigV3<Realtime.NodeData.Component, Realtime.NodeData.ComponentBuiltInPorts> = {
  ...NODE_CONFIG,

  label: 'Component',

  step: TemporaryVersionSwitch,
  action: Action,

  editorV2: LegacyComponentEditor,
  editorV3: ComponentEditor,
  editorV3FeaturFlag: Realtime.FeatureFlag.CMS_COMPONENTS,

  actionEditor: ActionEditor,

  tooltipText: 'Points the conversation to an existing Component.',
  tooltipLink: Documentation.COMPONENT_STEP,
};
