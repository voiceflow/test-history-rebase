import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { NodeEditorV2 } from '@/pages/Canvas/managers/types';

import APIEditor from './Api/Editor';
import { isCustomAPIEditor } from './utils';
import ZapierAndGoogleEditor from './ZapierAndGoogleEditor';

const IntegrationEditorV2: NodeEditorV2<Realtime.NodeData.Integration, Realtime.NodeData.IntegrationBuiltInPorts> = (props) => {
  if (isCustomAPIEditor(props)) return <APIEditor {...props} />;

  return <ZapierAndGoogleEditor {...props} />;
};

export default IntegrationEditorV2;
