import { Node } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { NodeEditor } from '@/pages/Canvas/managers/types';

import EntityCaptureEditor from './EntityCaptureEditor';
import QueryCaptureEditor from './QueryCaptureEditor';

const CaptureEditor: NodeEditor<Realtime.NodeData.CaptureV2, Realtime.NodeData.CaptureV2BuiltInPorts> = (props) => {
  switch (props.data.captureType) {
    case Node.CaptureV2.CaptureType.QUERY:
      return <QueryCaptureEditor {...props} />;
    case Node.CaptureV2.CaptureType.INTENT:
      return <EntityCaptureEditor {...props} />;
    default:
      return null;
  }
};

export default CaptureEditor;
