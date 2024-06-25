import * as Platform from '@voiceflow/platform-config';
import { serializeToText } from '@voiceflow/slate-serializer/text';
import { Preview, stopPropagation, toast } from '@voiceflow/ui';
import React from 'react';

import { ActiveDiagramNormalizedEntitiesAndVariablesContext } from '@/pages/Canvas/contexts';
import { copy } from '@/utils/clipboard';

interface PromptPreviewProps {
  title: string;
  prompts: Platform.Base.Models.Prompt.Model[];
  onClose: VoidFunction;
  onOpenEditor: VoidFunction;
}

const getPromptContent = (
  prompt: Platform.Base.Models.Prompt.Model,
  variablesMap: Record<string, { id: string; name: string }>
) => {
  if (Platform.Common.Chat.CONFIG.utils.prompt.isPrompt(prompt)) {
    return serializeToText(prompt.content, { variablesMap, encodeVariables: true });
  }

  if (Platform.Common.Voice.CONFIG.utils.prompt.isPrompt(prompt)) {
    return prompt.content;
  }

  return '';
};

const PromptsPreview: React.FC<PromptPreviewProps> = ({ title, prompts, onOpenEditor, onClose }) => {
  const entitiesAndVariables = React.useContext(ActiveDiagramNormalizedEntitiesAndVariablesContext)!;

  const copyTextToClipboard = (value: string) => {
    copy(value);
    toast.success('Copied to clipboard');
    onClose();
  };

  const copyAllToClipboard = () => {
    const allVariants = prompts.map((prompt) => getPromptContent(prompt, entitiesAndVariables.byKey)).join(' | ');
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
          const content = getPromptContent(noMatchPrompt, entitiesAndVariables.byKey);

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
        <Preview.ButtonIcon icon="edit" onClick={handleEditorClick} />
        <Preview.ButtonIcon icon="copy" ml={8} onClick={copyAllToClipboard} />
      </Preview.Footer>
    </Preview>
  );
};

export default PromptsPreview;
