export enum UploadType {
  CSV = 'CSV',
  INLINE = 'INLINE',
}

export const FILE_SIZE_LIMIT_KB = 512;
export const FILE_SIZE_LIMIT_BYTES = FILE_SIZE_LIMIT_KB * 1000;

export const UPLOAD_VARIANTS = [
  { id: UploadType.INLINE, label: 'In-line Editor' },
  { id: UploadType.CSV, label: 'CSV' },
];

export const ACCEPTED_FILE_TYPES = ['.csv', '.CSV', 'text/csv'];

export const DEBOUNCE_TIMEOUT = 300;
