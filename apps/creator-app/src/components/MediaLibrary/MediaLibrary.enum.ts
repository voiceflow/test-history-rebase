export enum MediaType {
  CARD = 'card',
  IMAGE = 'image',
  VIDEO = 'video',
}

export enum MediaMimeType {
  TEXT_ANY = 'text/*',
  TEXT_CSV = 'text/csv',

  IMAGE_PNG = 'image/png',
  IMAGE_GIF = 'image/gif',
  IMAGE_WEBP = 'image/webp',

  VIDEO_MP4 = 'video/mp4',
  VIDEO_MPEG = 'video/mpeg',
  VIDEO_WEBM = 'video/webm',

  AUDIO_MPEG = 'audio/mpeg',

  APPLICATION_ZIP = 'application/zip',
  APPLICATION_XML = 'application/xml',
  APPLICATION_JSON = 'application/json',
}

export enum MediaFileExtension {
  JPG = '.jpg',
  PNG = '.png',
  MP4 = '.mp4',
  GIF = '.gif',
  MP3 = '.mp3',
  CSV = '.csv',
  ZIP = '.zip',
  XML = '.xml',
  JPEG = '.jpeg',
  WEBP = '.webp',
  MPEG = '.mpeg',
  WEBM = '.webm',
  JSON = '.json',
}

export const MEDIA_FILE_TYPES = {
  IMAGE: [MediaFileExtension.JPG, MediaFileExtension.PNG, MediaFileExtension.GIF, MediaFileExtension.JPEG, MediaFileExtension.WEBP],

  VIDEO: [MediaFileExtension.MP4, MediaFileExtension.MPEG, MediaFileExtension.WEBM],

  AUDIO: [MediaFileExtension.MP3],

  CSV: [MediaFileExtension.CSV],

  ZIP: [MediaFileExtension.ZIP],

  XML: [MediaFileExtension.XML],

  JSON: [MediaFileExtension.JSON],
} satisfies Record<string, MediaFileExtension[]>;
