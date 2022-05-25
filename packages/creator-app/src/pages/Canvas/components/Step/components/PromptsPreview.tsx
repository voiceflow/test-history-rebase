import { ChatModels } from '@voiceflow/chat-types';
import { slate } from '@voiceflow/internal';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Preview, stopPropagation, toast } from '@voiceflow/ui';
import _isString from 'lodash/isString';
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
  if (_isString(noMatchPrompt.content)) return noMatchPrompt.content;
  return slate.toPlaintext((noMatchPrompt.content[0] as any)?.children);
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
        <Preview.ButtonIcon icon="editorEdit" mr={8} onClick={handleEditorClick} />
        <Preview.ButtonIcon icon="copy" onClick={copyAllToClipboard} />
      </Preview.Footer>
    </Preview>
  );
};

export default PromptsPreview;
