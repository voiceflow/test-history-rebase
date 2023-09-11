import { Attachment, RefUtil } from '@voiceflow/ui-next';
import { useAtomValue } from 'jotai';
import React, { useMemo } from 'react';

import { entitiesVariablesMapsAtom } from '@/atoms/other.atom';
import { CMSFormListItem } from '@/components/CMS/CMSForm/CMSFormListItem/CMSFormListItem.component';
import { MediaType } from '@/components/MediaLibrary/MediaLibrary.enum';
import { usePopperModifiers } from '@/hooks/popper.hook';
import { markupToString } from '@/utils/markup.util';

import { ResponseAttachmentContextMenu } from '../ResponseAttachmentContextMenu/ResponseAttachmentContextMenu.component';
import { ResponseAttachmentPopper } from '../ResponseAttachmentPopper/ResponseAttachmentPopper.component';
import type { IResponseMediaAttachment } from './ResponseMediaAttachment.interface';

export const ResponseMediaAttachment: React.FC<IResponseMediaAttachment> = ({ onRemove, attachment, onAttachmentDuplicate, ...props }) => {
  const entitiesVariablesMaps = useAtomValue(entitiesVariablesMapsAtom);

  const url = useMemo(() => markupToString.fromDB(attachment.url, entitiesVariablesMaps), [attachment.url, entitiesVariablesMaps]);

  const attachmentModifiers = usePopperModifiers([{ name: 'offset', options: { offset: [0, 12] } }]);

  return (
    <ResponseAttachmentPopper
      {...props}
      placement="right-start"
      modifiers={attachmentModifiers}
      attachment={attachment}
      initialView={`media-${MediaType.IMAGE}`}
      referenceElement={({ ref, isOpen, onOpen }) => (
        <ResponseAttachmentContextMenu
          onRemove={() => onRemove()}
          onDuplicate={() => onAttachmentDuplicate(attachment.id)}
          referenceElement={({ ref: contextMenuRef, isOpen: isContextMenuOpen, onContextMenu }) => (
            <CMSFormListItem pr={0} ref={RefUtil.composeRefs(ref, contextMenuRef)} gap={4} align="center" onRemove={() => onRemove()} showOnHover>
              <Attachment
                onClick={onOpen}
                isActive={isOpen || isContextMenuOpen}
                attachment={{ src: url, type: 'image', filename: attachment.name }}
                onContextMenu={onContextMenu}
              />
            </CMSFormListItem>
          )}
        />
      )}
    />
  );
};
