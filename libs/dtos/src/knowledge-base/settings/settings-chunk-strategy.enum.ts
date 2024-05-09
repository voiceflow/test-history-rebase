import type { Enum } from '@/utils/type/enum.util';

export const KBSettingsChunkStrategy = {
  RECURSIVE_TEXT_SPLITTER: 'recursive_text_splitter',
} as const;

export type KBSettingsChunkStrategy = Enum<typeof KBSettingsChunkStrategy>;
