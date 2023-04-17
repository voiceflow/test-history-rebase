import * as Platform from '@voiceflow/platform-config';
import React from 'react';

import * as ProjectV2 from '@/ducks/projectV2';
import { useSelector } from '@/hooks/redux';

import TextBasedEditor, { PromptInputTextEditorProps } from './TextEditor';
import VoiceBasedEditor, { PromptInputVoiceEditorProps } from './VoiceEditor';

interface PromptInputProps {
  value: Platform.Base.Models.Prompt.Model;
  onChange: (data: Platform.Base.Models.Prompt.Model) => void;
  placeholder?: string;
}

const PromptInput: React.FC<PromptInputProps> = (props) => {
  const projectType = useSelector(ProjectV2.active.projectTypeSelector);

  if (projectType === Platform.Constants.ProjectType.CHAT) {
    return <TextBasedEditor {...(props as unknown as PromptInputTextEditorProps)} />;
  }

  if (projectType === Platform.Constants.ProjectType.VOICE) {
    return <VoiceBasedEditor {...(props as unknown as PromptInputVoiceEditorProps)} />;
  }

  return null;
};

export default PromptInput;
