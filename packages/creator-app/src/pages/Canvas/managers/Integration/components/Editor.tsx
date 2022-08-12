import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { NodeEditorV2 } from '@/pages/Canvas/managers/types';

import APIForm from './APIForm';
import { isCustomAPIEditor } from './utils';
import ZapierAndGoogleEditor from './ZapierAndGoogleEditor';

const IntegrationEditorV2: NodeEditorV2<Realtime.NodeData.Integration, Realtime.NodeData.IntegrationBuiltInPorts> = (props) => {
  if (isCustomAPIEditor(props)) return <APIForm editor={props} />;

  return <ZapierAndGoogleEditor {...props} />;
};

export default IntegrationEditorV2;
