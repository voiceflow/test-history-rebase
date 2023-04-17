import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { ActionEditor } from '@/pages/Canvas/managers/types';

import ApiActionEditor from './Api/ActionEditor';
import { isCustomAPIActionEditor } from './utils';
import ZapierAndGoogleEditor from './ZapierAndGoogleEditor';

const IntegrationActionEditor: ActionEditor<Realtime.NodeData.Integration, Realtime.NodeData.IntegrationBuiltInPorts> = (props) => {
  if (isCustomAPIActionEditor(props)) {
    return <ApiActionEditor {...props} />;
  }

  return <ZapierAndGoogleEditor {...props} />;
};

export default IntegrationActionEditor;
