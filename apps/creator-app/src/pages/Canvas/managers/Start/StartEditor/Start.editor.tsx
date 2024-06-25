import type * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import EditorV2 from '@/pages/Canvas/components/EditorV2';

import { Actions } from '../../components';
import type { NodeEditorV2 } from '../../types';
import { StartEditorRoot } from './StartEditorRoot.component';

export const StartEditor: NodeEditorV2<Realtime.NodeData.Start> = () => (
  <EditorV2.Route component={StartEditorRoot}>
    <EditorV2.Route path={Actions.PATH} component={Actions.Editor} />
  </EditorV2.Route>
);
