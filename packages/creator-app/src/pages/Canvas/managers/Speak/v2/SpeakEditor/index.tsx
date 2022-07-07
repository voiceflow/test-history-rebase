import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { NodeEditorV2 } from '@/pages/Canvas/managers/types';

import { isVoiceItem } from '../../utils';
import AudioEditor from './components/AudioEditor';
import VoiceEditor from './components/VoiceEditor';

const SpeakEditor: NodeEditorV2<Realtime.NodeData.Speak, Realtime.NodeData.SpeakBuiltInPorts> = () => {
  const editor = EditorV2.useEditor<Realtime.NodeData.Speak, Realtime.NodeData.SpeakBuiltInPorts>();

  return isVoiceItem(editor.data.dialogs[0]) ? <VoiceEditor /> : <AudioEditor />;
};

export default SpeakEditor;
