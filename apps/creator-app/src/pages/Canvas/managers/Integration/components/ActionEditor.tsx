import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { ActionEditor } from '@/pages/Canvas/managers/types';

import ApiActionEditor from './Api/ActionEditor';

const IntegrationActionEditor: ActionEditor<Realtime.NodeData.CustomApi, Realtime.NodeData.IntegrationBuiltInPorts> = (props) => {
  return <ApiActionEditor {...props} />;
};

export default IntegrationActionEditor;
