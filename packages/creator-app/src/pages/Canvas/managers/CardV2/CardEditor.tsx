import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { Content } from '@/pages/Canvas/components/Editor';
import { NodeEditor } from '@/pages/Canvas/managers/types';

const CardEditor: NodeEditor<Realtime.NodeData.CardV2, Realtime.NodeData.CardV2BuiltInPorts> = () => {
  return <Content></Content>;
};

export default CardEditor;
