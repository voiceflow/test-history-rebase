import { BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';
import { Route } from 'react-router-dom';

import { Path } from '@/config/routes';

import { NodeEditorV2 } from '../../types';
import Root from './Root';

const DisplayEditor: NodeEditorV2<BaseNode.Visual.APLStepData, Realtime.NodeData.VisualBuiltInPorts> = () => (
  <Route path={Path.CANVAS_NODE} component={Root} />
);

export default DisplayEditor;
