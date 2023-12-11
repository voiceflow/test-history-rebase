import { MEDIA_FILE_TYPES, MediaMimeType } from '@/constants/media.constant';

export const ACCEPT_TYPES = {
  [MediaMimeType.IMAGE_PNG]: MEDIA_FILE_TYPES.PNG,
  [MediaMimeType.APPLICATION_PDF]: MEDIA_FILE_TYPES.PDF,
  [MediaMimeType.APPLICATION_MSWORD]: MEDIA_FILE_TYPES.DOC,
  [MediaMimeType.APPLICATION_DOCX]: MEDIA_FILE_TYPES.DOCX,
  [MediaMimeType.TEXT_PLAIN]: MEDIA_FILE_TYPES.TXT,
};
