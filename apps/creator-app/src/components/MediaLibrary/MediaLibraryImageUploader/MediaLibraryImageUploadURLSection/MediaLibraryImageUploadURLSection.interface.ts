import type { Markup } from '@voiceflow/sdk-logux-designer';

export interface IMediaLibraryImageUploadURLSection {
  error?: string;
  imageUrl?: Markup;
  isLoading?: boolean;
  onUrlSubmit: (value: Markup) => void;
}
