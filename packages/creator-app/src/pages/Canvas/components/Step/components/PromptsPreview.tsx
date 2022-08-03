import { ChatModels } from '@voiceflow/chat-types';
import { slate } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Preview, stopPropagation, toast } from '@voiceflow/ui';
import React from 'react';

import { copy } from '@/utils/clipboard';

type noMatchPrompt = Realtime.NodeData.VoicePrompt | ChatModels.Prompt;

interface PromptPreviewProps {
  title: string;
  prompts: Realtime.NodeData.VoicePrompt[] | ChatModels.Prompt[];
  onOpenEditor: () => void;
  onClose: () => void;
}

const getPromptContent = (noMatchPrompt: noMatchPrompt) => {
  if (Array.isArray(noMatchPrompt.content)) {
    const promptContent = noMatchPrompt.content.map((value: any) => {
      return slate.toPlaintext(value.children) as string;
    });
    return promptContent.join('\n');
  }
  return noMatchPrompt.content;
};

const PromptsPreview: React.FC<PromptPreviewProps> = ({ title, prompts, onOpenEditor, onClose }) => {
  const copyTextToClipboard = (value: string) => {
    copy(value);
    toast.success('Copied to clipboard');
    onClose();
  };

  const copyAllToClipboard = () => {
    const allVariants = prompts.map(getPromptContent).join(' | ');
    copyTextToClipboard(allVariants);
  };

  const handleEditorClick = () => {
    onOpenEditor();
    onClose();
  };

  return (
    <Preview onClick={stopPropagation()}>
      <Preview.Header>
        <Preview.Title>{title}</Preview.Title>
      </Preview.Header>

      <Preview.Content>
        {prompts.map((noMatchPrompt) => {
          const content = getPromptContent(noMatchPrompt);

          return (
            <Preview.ContentItem key={noMatchPrompt.id}>
              <Preview.Text>{content}</Preview.Text>
              <Preview.ContentIcon>
                <Preview.ButtonIcon icon="copy" onClick={() => copyTextToClipboard(content)} />
              </Preview.ContentIcon>
            </Preview.ContentItem>
          );
        })}
      </Preview.Content>

      <Preview.Footer>
        <Preview.ButtonIcon icon="editorEdit" onClick={handleEditorClick} />
        <Preview.ButtonIcon icon="copy" ml={8} onClick={copyAllToClipboard} />
      </Preview.Footer>
    </Preview>
  );
};

export default PromptsPreview;
