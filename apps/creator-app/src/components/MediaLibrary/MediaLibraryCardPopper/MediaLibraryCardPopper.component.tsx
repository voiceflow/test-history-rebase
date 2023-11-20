import { AttachmentType } from '@voiceflow/dtos';
import { Box, Divider, Section, SlateEditor, Surface } from '@voiceflow/ui-next';
import { markupFactory } from '@voiceflow/utils-designer';
import React from 'react';

import useMarkupWithVariables from '@/components/MarkupInput/MarkupInputWithVariables/MarkupInputWithVariables.hook';
import { Designer } from '@/ducks';
import { useDispatch, useSelector } from '@/hooks/store.hook';

import { MediaLibraryImageUploader } from '../MediaLibraryImageUploader/MediaLibraryImageUploader.component';
import { CardPopperButtonEditor } from './CardPopperButtonEditor/CardPopperButtonEditor.component';
import type { IMediaLibraryCardPopper } from './MediaLibraryCardPopper.interface';

export const MediaLibraryCardPopper: React.FC<IMediaLibraryCardPopper> = ({ card, onClose, onLibraryClick }) => {
  const buttons = useSelector(Designer.Attachment.CardButton.allByIDs, { ids: card.buttonOrder });
  const cardMedia = useSelector(Designer.Attachment.selectors.oneByID, { id: card.mediaID });

  const patchButton = useDispatch(Designer.Attachment.CardButton.effect.patchOne);
  const createButton = useDispatch(Designer.Attachment.CardButton.effect.createOne);
  const removeButton = useDispatch(Designer.Attachment.CardButton.effect.deleteOne);
  const patchOneCard = useDispatch(Designer.Attachment.effect.patchOneCard, card.id);

  const titleInput = useMarkupWithVariables({
    value: card.title,
    placeholder: 'Untitled card',
    onValueChange: (value) => patchOneCard({ title: value }),
  });

  const descriptionInput = useMarkupWithVariables({
    value: card.description,
    placeholder: 'Enter description',
    onValueChange: (value) => patchOneCard({ description: value }),
  });

  const onAddButton = async () => {
    await createButton({ cardID: card.id, label: markupFactory('') });
  };

  return (
    <Surface width="300px" pt={16} pb={24}>
      <Box mb={16} px={24} style={{ flexDirection: 'column' }}>
        <MediaLibraryImageUploader
          onClose={onClose}
          imageUrl={cardMedia?.type === AttachmentType.MEDIA ? cardMedia.url : undefined}
          onImageSelect={(mediaID) => patchOneCard({ mediaID })}
          onLibraryClick={onLibraryClick}
        />
      </Box>

      <Box mb={16} px={24}>
        <SlateEditor.SlateEditorTwoLineInput lineOne={titleInput} lineTwo={descriptionInput} />
      </Box>

      <Divider />

      <Box mt={12} direction="column">
        <Section.Header.Container title="Buttons" variant="active">
          <Section.Header.Button iconName="Plus" onClick={onAddButton} />
        </Section.Header.Container>

        <Box pl={12} pr={16} direction="column">
          {buttons.map((button) => (
            <CardPopperButtonEditor
              key={button.id}
              label={button.label}
              onRemove={() => removeButton(button.id)}
              onLabelChange={(label) => patchButton(button.id, { label })}
            />
          ))}
        </Box>
      </Box>
    </Surface>
  );
};
