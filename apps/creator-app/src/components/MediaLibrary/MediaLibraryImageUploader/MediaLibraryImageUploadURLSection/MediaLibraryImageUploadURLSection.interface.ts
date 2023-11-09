import type { Markup } from '@voiceflow/dtos';

export interface IMediaLibraryImageUploadURLSection {
  error?: string;
  imageUrl?: Markup;
  isLoading?: boolean;
  onUrlSubmit: (value: Markup) => void;
}
