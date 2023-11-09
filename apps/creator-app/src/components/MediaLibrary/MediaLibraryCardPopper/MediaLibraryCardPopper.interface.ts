import type { CardAttachment } from '@voiceflow/dtos';

import type { IMediaLibraryImageUploader } from '../MediaLibraryImageUploader/MediaLibraryImageUploader.interface';

export interface IMediaLibraryCardPopper extends Omit<IMediaLibraryImageUploader, 'imageUrl' | 'onImageSelect'> {
  card: CardAttachment;
}
