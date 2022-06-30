import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';
import { Route, Switch } from 'react-router-dom';

import { Path } from '@/config/routes';
import { NodeEditorV2 } from '@/pages/Canvas/managers/types';

import TextRootEditor from './TextRootEditor';

const TextEditor: NodeEditorV2<Realtime.NodeData.Text, Realtime.NodeData.TextBuiltInPorts> = () => (
  <Switch>
    <Route path={Path.CANVAS_NODE} component={TextRootEditor} />
  </Switch>
);

export default TextEditor;
