import { Utils } from '@voiceflow/common';
import { Box, Preview, stopPropagation, Tag } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/constants/permissions';
import { useEntityEditModal } from '@/hooks/modal.hook';
import { usePermission } from '@/hooks/permission';
import type { EntityPrompt } from '@/pages/Canvas/types';
import { copyWithToast } from '@/utils/clipboard';

interface ButtonsPreviewProps {
  prompt?: EntityPrompt | null;
  onClose: VoidFunction;
  onOpenEditor: VoidFunction;
}

const CapturePreview: React.FC<ButtonsPreviewProps> = ({ prompt, onOpenEditor, onClose }) => {
  const [canOpenEditor] = usePermission(Permission.PROJECT_CANVAS_OPEN_EDITOR);
  const entityEditModal = useEntityEditModal();

  if (!prompt) return null;

  return (
    // eslint-disable-next-line no-empty-function
    <Preview onClick={stopPropagation(() => {})}>
      <Preview.Header>
        <Preview.Title>Entity reprompt</Preview.Title>
      </Preview.Header>

      <Preview.Content>
        <Preview.ContentItem key={prompt.id}>
          <Box.FlexAlignStart flexDirection="column">
            <Box mb="4px">
              <Tag
                onClick={() => canOpenEditor && entityEditModal.openVoid({ entityID: prompt.entityID })}
                color={prompt.color}
              >{`{${prompt.name}}`}</Tag>
            </Box>

            <Preview.Text>{prompt.content}</Preview.Text>
          </Box.FlexAlignStart>

          <Preview.ContentIcon>
            <Preview.ButtonIcon icon="copy" onClick={Utils.functional.chain(copyWithToast(prompt.content), onClose)} />
          </Preview.ContentIcon>
        </Preview.ContentItem>
      </Preview.Content>

      {canOpenEditor && (
        <Preview.Footer>
          <Preview.ButtonIcon icon="edit" onClick={Utils.functional.chain(onOpenEditor, onClose)} />
        </Preview.Footer>
      )}
    </Preview>
  );
};

export default CapturePreview;
