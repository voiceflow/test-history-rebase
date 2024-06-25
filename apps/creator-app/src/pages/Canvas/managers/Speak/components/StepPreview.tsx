import { Utils } from '@voiceflow/common';
import type * as Realtime from '@voiceflow/realtime-sdk';
import { Preview, stopPropagation } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/constants/permissions';
import { usePermission } from '@/hooks/permission';
import { ActiveDiagramNormalizedEntitiesAndVariablesContext } from '@/pages/Canvas/contexts';
import { copyWithToast } from '@/utils/clipboard';
import { transformVariablesToReadable } from '@/utils/slot';

import { isVoiceItem } from './utils';

interface StepPreviewProps {
  items: Realtime.SpeakData[];
  onClose: VoidFunction;
  onOpenEditor: VoidFunction;
}

const StepPreview: React.FC<StepPreviewProps> = ({ items, onClose, onOpenEditor }) => {
  const entitiesAndVariables = React.useContext(ActiveDiagramNormalizedEntitiesAndVariablesContext)!;

  const [canOpenEditor] = usePermission(Permission.PROJECT_CANVAS_OPEN_EDITOR);

  const preparedItems = React.useMemo(() => {
    const formatItemContentOrURL = (content: string) =>
      Utils.string.stripHTMLTags(transformVariablesToReadable(content || '', entitiesAndVariables.byKey));

    return items.map((item) =>
      isVoiceItem(item)
        ? { ...item, content: formatItemContentOrURL(item.content) }
        : { ...item, url: formatItemContentOrURL(item.url) }
    );
  }, [items, entitiesAndVariables.byKey]);

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
                onClick={Utils.functional.chainVoid(
                  copyWithToast(isVoiceItem(item) ? item.content : item.url),
                  onClose
                )}
              />
            </Preview.ContentIcon>
          </Preview.ContentItem>
        ))}
      </Preview.Content>

      <Preview.Footer>
        {canOpenEditor && (
          <Preview.ButtonIcon icon="edit" onClick={Utils.functional.chainVoid(onOpenEditor, onClose)} />
        )}

        <Preview.ButtonIcon ml={8} icon="copy" onClick={onCopyAll} />
      </Preview.Footer>
    </Preview>
  );
};

export default StepPreview;
