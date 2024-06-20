import * as Realtime from '@voiceflow/realtime-sdk';
import { Editor } from '@voiceflow/ui-next';
import React from 'react';

import { ActionEditor } from '@/pages/Canvas/managers/types';

import { SetV3EditorForm } from './SetV3Editor/SetV3EditorForm.component';

export const SetV3ActionEditor: ActionEditor<Realtime.NodeData.SetV2, Realtime.NodeData.SetV2BuiltInPorts> = (
  props
) => (
  <Editor title={props.label} readOnly headerActions={null}>
    <SetV3EditorForm editor={props} />
  </Editor>
);
