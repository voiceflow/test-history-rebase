import { ImageLibrary } from '@voiceflow/ui-next';
import React, { useMemo } from 'react';

import { Designer } from '@/ducks';
import { useDispatch, useSelector } from '@/hooks/store.hook';
import { markupToString } from '@/utils/markup.util';

import type { IMediaLibraryImagesPopper } from './MediaLibraryImagesPopper.interface';

export const MediaLibraryImagesPopper: React.FC<IMediaLibraryImagesPopper> = ({ onImageSelect }) => {
  const imagesAttachments = useSelector(Designer.Attachment.selectors.allMediaImageAssets);
  const deleteOne = useDispatch(Designer.Attachment.effect.deleteOne);

  const images = useMemo(
    () =>
      imagesAttachments.map(({ id, url, name }) => ({
        id,
        url: markupToString.fromDB(url, { entitiesMapByID: {}, variablesMapByID: {} }),
        name,
      })),
    [imagesAttachments]
  );

  return <ImageLibrary images={images} onImageSelect={({ id }) => onImageSelect(id)} onImageRemove={({ id }) => deleteOne(id)} />;
};
