import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { NodeEditorV2 } from '@/pages/Canvas/managers/types';

import Form from './Form';

const GoToNodeEditor: NodeEditorV2<Realtime.NodeData.GoToNode> = (props) => <Form editor={props} />;

export default GoToNodeEditor;
