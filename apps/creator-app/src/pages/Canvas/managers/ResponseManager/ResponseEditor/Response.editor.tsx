import type * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import EditorV2 from '@/pages/Canvas/components/EditorV2';

import type { NodeEditorV2 } from '../../types';
import { ResponseEditorRoot } from './ResponseEditorRoot.component';

export const ResponseEditor: NodeEditorV2<Realtime.NodeData.Response> = () => (
  <EditorV2.Route component={ResponseEditorRoot}></EditorV2.Route>
);
