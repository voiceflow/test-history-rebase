import type * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import type { NodeEditorV2 } from '@/pages/Canvas/managers/types';

import Form from './Form';

const GoToDomainEditor: NodeEditorV2<Realtime.NodeData.GoToDomain> = (props) => <Form editor={props} />;

export default GoToDomainEditor;
