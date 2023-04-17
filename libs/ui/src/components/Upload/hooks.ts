import React from 'react';

import { FILE_TYPE_MIME_MAP } from './constants';

export const useFileTypesToMimeType = (fileTypes: string[]) =>
  React.useMemo(
    () =>
      fileTypes.reduce<Record<string, string[]>>((acc, ext) => {
        const mimeType = FILE_TYPE_MIME_MAP[ext];

        if (mimeType) {
          acc[mimeType] ??= [];
          acc[mimeType].push(ext);
        }

        return acc;
      }, {}),
    [fileTypes]
  );
