import type * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import EditorV2 from '@/pages/Canvas/components/EditorV2';

import type { NodeEditorV2 } from '../../types';
import { FunctionEditorRoot } from './FunctionEditorRoot.component';

export const FunctionEditor: NodeEditorV2<Realtime.NodeData.Function> = () => (
  <EditorV2.Route component={FunctionEditorRoot}></EditorV2.Route>
);
