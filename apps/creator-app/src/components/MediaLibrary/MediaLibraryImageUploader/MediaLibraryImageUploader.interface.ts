import type { Markup } from '@voiceflow/sdk-logux-designer';

export interface IMediaLibraryImageUploader {
  onClose: VoidFunction;
  imageUrl?: Markup;
  onImageSelect: (attachmentID: string) => void;
  onLibraryClick?: VoidFunction;
}
