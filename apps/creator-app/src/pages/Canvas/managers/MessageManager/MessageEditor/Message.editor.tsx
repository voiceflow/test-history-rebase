import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import EditorV2 from '@/pages/Canvas/components/EditorV2';

import { NodeEditorV2 } from '../../types';
import { MessageEditorRoot } from './MessageEditorRoot.component';

export const MessageEditor: NodeEditorV2<Realtime.NodeData.Response> = () => (
  <EditorV2.Route component={MessageEditorRoot}></EditorV2.Route>
);
