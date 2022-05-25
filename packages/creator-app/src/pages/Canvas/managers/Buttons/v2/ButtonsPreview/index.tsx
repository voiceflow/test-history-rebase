import { Box, Flex, Preview, stopPropagation, Tag, toast } from '@voiceflow/ui';
import React from 'react';

import { InteractionModelTabType } from '@/constants';
import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks';
import { copy } from '@/utils/clipboard';

import { EntityPrompt } from '../types';

interface ButtonsPreviewProps {
  prompts: EntityPrompt[];
  onOpenEditor: () => void;
  onClose: () => void;
}

const ButtonsPreview: React.FC<ButtonsPreviewProps> = ({ prompts, onOpenEditor, onClose }) => {
  const openEntityModal = useDispatch(Router.goToCurrentCanvasInteractionModelEntity, InteractionModelTabType.SLOTS);

  const copyTextToClipboard = (value: string) => {
    copy(value);
    toast.success('Copied to clipboard');
    onClose();
  };

  const handleEditorClick = () => {
    onOpenEditor();
    onClose();
  };

  return (
    <Preview onClick={stopPropagation()}>
      <Preview.Header>
        <Preview.Title>Entity prompt</Preview.Title>
      </Preview.Header>

      <Preview.Content>
        {prompts.map((prompt) => (
          <Preview.ContentItem key={prompt.id}>
            <Flex style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
              <Box mb="4px">
                <Tag color={prompt.color} onClick={() => openEntityModal(prompt.id)}>{`{${prompt.name}}`}</Tag>
              </Box>
              <Preview.Text>{prompt.content}</Preview.Text>
            </Flex>
            <Preview.ContentIcon>
              <Preview.ButtonIcon icon="copy" onClick={() => copyTextToClipboard(prompt.content)} />
            </Preview.ContentIcon>
          </Preview.ContentItem>
        ))}
      </Preview.Content>

      <Preview.Footer>
        <Preview.ButtonIcon icon="editorEdit" onClick={handleEditorClick} />
      </Preview.Footer>
    </Preview>
  );
};

export default ButtonsPreview;
