import { BaseNode } from '@voiceflow/base-types';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { usePreviousValue } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';

import IntentEditor from './IntentEditor';
import QueryEditor from './QueryEditor';

const RootEditor: React.FC = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.CaptureV2, Realtime.NodeData.CaptureV2BuiltInPorts>();
  const prevType = usePreviousValue(editor.data.captureType);

  const isEntireQuery = editor.data.captureType === BaseNode.CaptureV2.CaptureType.QUERY;
  const disableAnimation = !!prevType && prevType !== editor.data.captureType;

  if (!isEntireQuery) return <IntentEditor disableAnimation={disableAnimation} />;

  return <QueryEditor disableAnimation={disableAnimation} />;
};

export default RootEditor;
