import { Box, Flex, Preview, stopPropagation, Tag, toast } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/config/permissions';
import { InteractionModelTabType } from '@/constants';
import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks';
import { usePermission } from '@/hooks/permission';
import { EntityPrompt } from '@/pages/Canvas/types';
import { copy } from '@/utils/clipboard';

interface ButtonsPreviewProps {
  prompt?: EntityPrompt | null;
  onOpenEditor: () => void;
  onClose: () => void;
}

const CapturePreview: React.FC<ButtonsPreviewProps> = ({ prompt, onOpenEditor, onClose }) => {
  const [canOpenEditor] = usePermission(Permission.OPEN_EDITOR);

  const goToQuickviewModelEntity = useDispatch(Router.goToCurrentCanvasInteractionModelEntity);

  const copyTextToClipboard = (value: string) => {
    copy(value);
    toast.success('Copied to clipboard');
    onClose();
  };

  const handleEditorClick = () => {
    onOpenEditor();
    onClose();
  };

  const openEntityModal = (entityID: string) => {
    goToQuickviewModelEntity(InteractionModelTabType.SLOTS, entityID);
  };

  if (!prompt) return null;

  return (
    <Preview onClick={stopPropagation(() => {})}>
      <Preview.Header>
        <Preview.Title>Entity prompt</Preview.Title>
      </Preview.Header>

      <Preview.Content>
        <Preview.ContentItem key={prompt.id}>
          <Flex style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <Box mb="4px">
              <Tag onClick={() => openEntityModal(prompt.id)} color={prompt.color}>{`{${prompt.name}}`}</Tag>
            </Box>
            <Preview.Text>{prompt.content}</Preview.Text>
          </Flex>
          <Preview.ContentIcon>
            <Preview.ButtonIcon icon="copy" onClick={() => copyTextToClipboard(prompt.content)} />
          </Preview.ContentIcon>
        </Preview.ContentItem>
      </Preview.Content>

      {canOpenEditor && (
        <Preview.Footer>
          <Preview.ButtonIcon icon="editorEdit" onClick={handleEditorClick} />
        </Preview.Footer>
      )}
    </Preview>
  );
};

export default CapturePreview;
