import { Utils } from '@voiceflow/common';
import { Box, Preview, stopPropagation, Tag } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/constants/permissions';
import { useEntityEditModal } from '@/hooks/modal.hook';
import { usePermission } from '@/hooks/permission';
import { EntityPrompt } from '@/pages/Canvas/types';
import { copyWithToast } from '@/utils/clipboard';

interface ButtonsPreviewProps {
  prompts: EntityPrompt[];
  onClose: VoidFunction;
  onOpenEditor: VoidFunction;
}

const ButtonPreview: React.FC<ButtonsPreviewProps> = ({ prompts, onOpenEditor, onClose }) => {
  const [canOpenEditor] = usePermission(Permission.CANVAS_OPEN_EDITOR);
  const entityEditModal = useEntityEditModal();

  return (
    <Preview onClick={stopPropagation()}>
      <Preview.Header>
        <Preview.Title>Entity reprompt</Preview.Title>
      </Preview.Header>

      <Preview.Content>
        {prompts.map((prompt) => (
          <Preview.ContentItem key={prompt.id}>
            <Box.Flex flexDirection="column" alignItems="flex-start">
              <Box mb="4px">
                <Tag
                  color={prompt.color}
                  onClick={() => canOpenEditor && entityEditModal.openVoid({ entityID: prompt.entityID })}
                >{`{${prompt.name}}`}</Tag>
              </Box>

              <Preview.Text>{prompt.content}</Preview.Text>
            </Box.Flex>

            <Preview.ContentIcon>
              <Preview.ButtonIcon icon="copy" onClick={Utils.functional.chain(copyWithToast(prompt.content), onClose)} />
            </Preview.ContentIcon>
          </Preview.ContentItem>
        ))}
      </Preview.Content>

      {canOpenEditor && (
        <Preview.Footer>
          <Preview.ButtonIcon icon="edit" onClick={Utils.functional.chain(onOpenEditor, onClose)} />
        </Preview.Footer>
      )}
    </Preview>
  );
};

export default ButtonPreview;
