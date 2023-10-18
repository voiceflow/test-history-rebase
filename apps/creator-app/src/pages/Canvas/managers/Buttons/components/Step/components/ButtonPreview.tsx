import { Utils } from '@voiceflow/common';
import { Box, Preview, stopPropagation, Tag } from '@voiceflow/ui';
import React from 'react';

import { InteractionModelTabType } from '@/constants';
import { Permission } from '@/constants/permissions';
import * as Router from '@/ducks/router';
import { useDispatch } from '@/hooks';
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
  const goToNLUQuickViewEntity = useDispatch(Router.goToNLUQuickViewEntity, InteractionModelTabType.SLOTS);

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
                <Tag color={prompt.color} onClick={() => goToNLUQuickViewEntity(prompt.id)}>{`{${prompt.name}}`}</Tag>
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
