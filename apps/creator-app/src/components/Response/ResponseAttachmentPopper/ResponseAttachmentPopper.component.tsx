import { Utils } from '@voiceflow/common';
import { AttachmentType } from '@voiceflow/dtos';
import { Popper } from '@voiceflow/ui-next';
import { markupFactory } from '@voiceflow/utils-designer';
import React, { useState } from 'react';

import { MediaType } from '@/components/MediaLibrary/MediaLibrary.enum';
import { MediaLibraryCardPopper } from '@/components/MediaLibrary/MediaLibraryCardPopper/MediaLibraryCardPopper.component';
import { MediaLibraryImagesPopper } from '@/components/MediaLibrary/MediaLibraryImagesPopper/MediaLibraryImagesPopper.component';
import { MediaLibraryImageUploadPopper } from '@/components/MediaLibrary/MediaLibraryImageUploadPopper/MediaLibraryImageUploadPopper.component';
import { MediaLibraryTypeMenu } from '@/components/MediaLibrary/MediaLibraryTypeMenu/MediaLibraryTypeMenu.component';
import { Switch } from '@/components/Switch';
import { Designer } from '@/ducks';
import { useDispatch } from '@/hooks/store.hook';

import type { IResponseAttachmentPopper, View } from './ResponseAttachmentPopper.interface';

export const ResponseAttachmentPopper: React.FC<IResponseAttachmentPopper> = ({
  placement = 'bottom-end',
  attachment,
  initialView = 'type-menu',
  referenceElement,
  onAttachmentSelect,
  ...props
}) => {
  const [view, setView] = useState<View>(initialView);
  const createAttachmentCard = useDispatch(Designer.Attachment.effect.createOneCard);

  const onTypeSelect = (onClose: VoidFunction) => async (type: MediaType) => {
    setView(`media-${type}`);

    if (type !== MediaType.CARD) {
      onClose();

      const card = await createAttachmentCard({
        title: markupFactory(''),
        description: markupFactory(''),
        mediaID: null,
        buttonOrder: [],
      });

      await onAttachmentSelect({ id: card.id, type: AttachmentType.CARD });
    }
  };

  return (
    <Popper
      {...props}
      placement={placement}
      referenceElement={({ onOpen, ...refProps }) =>
        referenceElement?.({ ...refProps, onOpen: Utils.functional.chain(onOpen, () => setView(initialView)) })
      }
    >
      {({ onClose }) => (
        <Switch value={view}>
          <Switch.Pane value="type-menu">
            <MediaLibraryTypeMenu
              onTypeSelect={onTypeSelect(onClose)}
              onLibraryClick={(type) => setView(`library-${type}`)}
            />
          </Switch.Pane>

          <Switch.Pane value={`media-${MediaType.IMAGE}`}>
            <MediaLibraryImageUploadPopper
              onClose={onClose}
              imageUrl={attachment?.type === AttachmentType.MEDIA ? attachment?.url : undefined}
              onImageSelect={(id) => onAttachmentSelect({ id, type: AttachmentType.MEDIA })}
              onLibraryClick={() => setView(`library-${MediaType.IMAGE}`)}
            />
          </Switch.Pane>

          <Switch.Pane value={`media-${MediaType.CARD}`}>
            {attachment?.type === AttachmentType.CARD && (
              <MediaLibraryCardPopper
                card={attachment}
                onClose={onClose}
                onLibraryClick={() => setView(`library-${MediaType.IMAGE}`)}
              />
            )}
          </Switch.Pane>

          <Switch.Pane value={`library-${MediaType.IMAGE}`}>
            <MediaLibraryImagesPopper
              onImageSelect={Utils.functional.chainAsync(
                (id: string) => onAttachmentSelect({ id, type: AttachmentType.MEDIA }),
                onClose
              )}
            />
          </Switch.Pane>

          {/* TODO: Video poppers and card library */}
        </Switch>
      )}
    </Popper>
  );
};
