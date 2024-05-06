import { z } from 'zod';

export const DocumentDownloadResponse = z.instanceof(Uint8Array);

export type DocumentDownloadResponse = z.infer<typeof DocumentDownloadResponse>;
