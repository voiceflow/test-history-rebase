import type { CardAttachment } from '@voiceflow/sdk-logux-designer';

import type { IMediaLibraryImageUploader } from '../MediaLibraryImageUploader/MediaLibraryImageUploader.interface';

export interface IMediaLibraryCardPopper extends Omit<IMediaLibraryImageUploader, 'imageUrl' | 'onImageSelect'> {
  card: CardAttachment;
}
