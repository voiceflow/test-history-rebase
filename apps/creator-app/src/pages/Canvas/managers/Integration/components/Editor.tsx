import type * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import type { NodeEditorV2 } from '@/pages/Canvas/managers/types';

import APIEditor from './Api/Editor';

const IntegrationEditorV2: NodeEditorV2<Realtime.NodeData.CustomApi, Realtime.NodeData.IntegrationBuiltInPorts> = (
  props
) => {
  return <APIEditor {...props} />;
};

export default IntegrationEditorV2;
