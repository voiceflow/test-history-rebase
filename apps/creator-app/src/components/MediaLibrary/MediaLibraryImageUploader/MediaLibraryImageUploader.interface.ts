import type { Markup } from '@voiceflow/dtos';

export interface IMediaLibraryImageUploader {
  onClose: VoidFunction;
  imageUrl?: Markup;
  onImageSelect: (attachmentID: string) => void;
  onLibraryClick?: VoidFunction;
}
