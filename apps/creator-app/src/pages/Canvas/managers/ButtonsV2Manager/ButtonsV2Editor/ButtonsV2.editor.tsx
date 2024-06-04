import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import EditorV2 from '@/pages/Canvas/components/EditorV2';

import { Actions } from '../../components';
import { NodeEditorV2 } from '../../types';
import { ButtonsV2EditorRoot } from './ButtonsV2EditorRoot.component';

export const ButtonsV2Editor: NodeEditorV2<Realtime.NodeData.ButtonsV2> = () => (
  <EditorV2.Route component={ButtonsV2EditorRoot}>
    <EditorV2.Route path={Actions.PATH} component={Actions.Editor} />
  </EditorV2.Route>
);
