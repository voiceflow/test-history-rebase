import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import EditorV2 from '@/pages/Canvas/components/EditorV2';

import { Actions } from '../../components';
import { NodeEditorV2 } from '../../types';
import { TriggerEditorRoot } from './TriggerEditorRoot.component';

export const TriggerEditor: NodeEditorV2<Realtime.NodeData.Trigger> = () => (
  <EditorV2.Route component={TriggerEditorRoot}>
    <EditorV2.Route path={Actions.PATH} component={Actions.Editor} />
  </EditorV2.Route>
);
