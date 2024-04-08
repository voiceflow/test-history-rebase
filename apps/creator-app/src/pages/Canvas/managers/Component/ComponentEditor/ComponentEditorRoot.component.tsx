import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { EditorV3HeaderActions } from '@/pages/Canvas/components/EditorV3/EditorV3HeaderActions.component';
import { NodeEditorV2 } from '@/pages/Canvas/managers/types';

import { ComponentEditorBase } from './ComponentEditorBase.component';

export const ComponentEditorRoot: NodeEditorV2<Realtime.NodeData.Component> = () => <ComponentEditorBase headerActions={<EditorV3HeaderActions />} />;
