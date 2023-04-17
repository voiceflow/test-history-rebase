import { Utils } from '@voiceflow/common';
import { Preview, stopPropagation } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/constants/permissions';
import { usePermission } from '@/hooks/permission';
import { copyWithToast } from '@/utils/clipboard';

import { StepItem } from './types';

interface StepPreviewProps {
  items: StepItem[];
  onClose: VoidFunction;
  onOpenEditor: VoidFunction;
}

const StepPreview: React.FC<StepPreviewProps> = ({ items, onClose, onOpenEditor }) => {
  const [canOpenEditor] = usePermission(Permission.CANVAS_OPEN_EDITOR);

  const onCopyAll = () => {
    const allVariants = items.map((item) => item.text).join(' | ');

    copyWithToast(allVariants, 'All variants copied to clipboard')();

    onClose();
  };

  return (
    <Preview onClick={stopPropagation()}>
      <Preview.Header>
        <Preview.Title>All variants</Preview.Title>
      </Preview.Header>

      <Preview.Content>
        {items.map((item) => (
          <Preview.ContentItem key={item.id}>
            <Preview.Text>{item.content}</Preview.Text>

            <Preview.ContentIcon>
              <Preview.ButtonIcon icon="copy" onClick={Utils.functional.chainVoid(copyWithToast(item.text), onClose)} />
            </Preview.ContentIcon>
          </Preview.ContentItem>
        ))}
      </Preview.Content>

      <Preview.Footer>
        {canOpenEditor && <Preview.ButtonIcon icon="edit" onClick={Utils.functional.chainVoid(onOpenEditor, onClose)} />}

        <Preview.ButtonIcon ml={8} icon="copy" onClick={onCopyAll} />
      </Preview.Footer>
    </Preview>
  );
};

export default StepPreview;
