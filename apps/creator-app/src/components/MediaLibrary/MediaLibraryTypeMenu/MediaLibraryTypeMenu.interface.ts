import type { MediaType } from '../MediaLibrary.enum';

export interface IMediaLibraryTypeMenu {
  width?: number;
  onTypeSelect: (type: MediaType) => void;
  onLibraryClick: (type: MediaType) => void;
}
