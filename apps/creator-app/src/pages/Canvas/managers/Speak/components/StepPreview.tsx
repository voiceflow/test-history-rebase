import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { Preview, stopPropagation } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/constants/permissions';
import { usePermission } from '@/hooks/permission';
import { copyWithToast } from '@/utils/clipboard';
import { transformVariablesToReadable } from '@/utils/slot';

import { isVoiceItem } from './utils';

interface StepPreviewProps {
  items: Realtime.SpeakData[];
  onClose: VoidFunction;
  onOpenEditor: VoidFunction;
}

const formatItemContentOrURL = (content: string) => Utils.string.stripHTMLTags(transformVariablesToReadable(content || ''));

const StepPreview: React.FC<StepPreviewProps> = ({ items, onClose, onOpenEditor }) => {
  const [canOpenEditor] = usePermission(Permission.CANVAS_OPEN_EDITOR);

  const preparedItems = React.useMemo(
    () =>
      items.map((item) =>
        isVoiceItem(item) ? { ...item, content: formatItemContentOrURL(item.content) } : { ...item, url: formatItemContentOrURL(item.url) }
      ),
    [items]
  );

  const onCopyAll = () => {
    const allVariants = preparedItems.map((item) => (isVoiceItem(item) ? item.content : item.url)).join(' | ');

    copyWithToast(allVariants, 'All variants copied to clipboard')();

    onClose();
  };

  return (
    <Preview onClick={stopPropagation()}>
      <Preview.Header>
        <Preview.Title>All variants</Preview.Title>
      </Preview.Header>

      <Preview.Content>
        {preparedItems.map((item) => (
          <Preview.ContentItem key={item.id}>
            <Preview.Text>{isVoiceItem(item) ? item.content : item.url}</Preview.Text>

            <Preview.ContentIcon>
              <Preview.ButtonIcon
                icon="copy"
                onClick={Utils.functional.chainVoid(copyWithToast(isVoiceItem(item) ? item.content : item.url), onClose)}
              />
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
