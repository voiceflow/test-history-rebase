import { Attachment, RefUtil } from '@voiceflow/ui-next';
import { markupToString } from '@voiceflow/utils-designer';
import { useAtomValue } from 'jotai';
import React, { useMemo } from 'react';

import { entitiesVariablesMapsAtom } from '@/atoms/other.atom';
import { CMSFormListItem } from '@/components/CMS/CMSForm/CMSFormListItem/CMSFormListItem.component';
import { useMarkupWithVariables } from '@/components/MarkupInput/MarkupInputWithVariables/MarkupInputWithVariables.hook';
import { MediaType } from '@/components/MediaLibrary/MediaLibrary.enum';
import { Designer } from '@/ducks';
import { usePopperModifiers } from '@/hooks/popper.hook';
import { useSelector } from '@/hooks/store.hook';
import { markupToSlate } from '@/utils/markup.util';

import { ResponseAttachmentContextMenu } from '../ResponseAttachmentContextMenu/ResponseAttachmentContextMenu.component';
import { ResponseAttachmentPopper } from '../ResponseAttachmentPopper/ResponseAttachmentPopper.component';
import type { IResponseCardAttachment } from './ResponseCardAttachment.interface';

export const ResponseCardAttachment: React.FC<IResponseCardAttachment> = ({
  onRemove,
  attachment,
  onAttachmentSelect,
  onAttachmentDuplicate,
  ...props
}) => {
  const media = useSelector(Designer.Attachment.selectors.oneMediaImageByID, { id: attachment?.mediaID });

  const entitiesVariablesMaps = useAtomValue(entitiesVariablesMapsAtom);

  const titleInput = useMarkupWithVariables({ value: attachment.title });

  const url = useMemo(
    () => (media ? markupToString.fromDB(media?.url, entitiesVariablesMaps) : undefined),
    [media?.url, entitiesVariablesMaps]
  );
  const description = useMemo(() => markupToSlate.fromDB(attachment.description), [attachment.description]);

  const attachmentModifiers = usePopperModifiers([{ name: 'offset', options: { offset: [0, 12] } }]);

  return (
    <ResponseAttachmentPopper
      {...props}
      modifiers={attachmentModifiers}
      placement="right-start"
      attachment={attachment}
      initialView={`media-${MediaType.CARD}`}
      onAttachmentSelect={onAttachmentSelect}
      referenceElement={({ ref, isOpen, onOpen }) => (
        <ResponseAttachmentContextMenu
          onRemove={() => onRemove()}
          onDuplicate={() => onAttachmentDuplicate(attachment.id)}
          referenceElement={({ ref: contextMenuRef, isOpen: isContextMenuOpen, onContextMenu }) => (
            <CMSFormListItem
              pr={0}
              ref={RefUtil.composeRefs(ref, contextMenuRef)}
              gap={4}
              align="center"
              onRemove={() => onRemove()}
              showOnHover
            >
              <Attachment
                onClick={onOpen}
                isActive={isOpen || isContextMenuOpen}
                attachment={{ src: url, type: 'card', title: titleInput.value, description, isUploading: false }}
                onContextMenu={onContextMenu}
                pluginsOptions={titleInput.pluginsOptions}
              />
            </CMSFormListItem>
          )}
        />
      )}
    />
  );
};
