import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import EditorV3 from '@/pages/Canvas/components/EditorV3';
import { NodeEditorV2 } from '@/pages/Canvas/managers/types';

import { ComponentEditorBase } from './ComponentEditorBase.component';

export const ComponentEditorRoot: NodeEditorV2<Realtime.NodeData.Component> = () => (
  <ComponentEditorBase headerActions={<EditorV3.HeaderActions />} />
);