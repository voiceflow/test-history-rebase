import { useCreateConst, usePersistFunction } from '@voiceflow/ui-next';
import React, { useEffect } from 'react';
import { useDrop } from 'react-dnd';
import { NativeTypes } from 'react-dnd-html5-backend';

import { MediaMimeType } from '@/constants/media.constant';
import { imageSizeFromUrl } from '@/utils/file';

export interface Dimensions {
  width: number;
  height: number;
  ratio: number;
}

export function useImageDimensions({ url, disabled = false }: { url?: string | null; disabled?: boolean }) {
  const [dimensions, setDimensions] = React.useState<Dimensions | null>(null);

  React.useLayoutEffect(() => {
    if (!disabled && url) {
      imageSizeFromUrl(url)
        .then(({ width, height }) => setDimensions({ width, height, ratio: (height / width) * 100 }))
        // eslint-disable-next-line no-empty-function
        .catch(() => {});
    }
  }, [url, disabled]);

  return dimensions;
}

/**
 * file reader utility hook
 * reads one file at a time, aborts previous read if new read is called
 */
export const useFileReader = () => {
  const fileReaderRef = React.useRef<FileReader | null>(null);

  const singleton = usePersistFunction(() => {
    if (!fileReaderRef.current) {
      fileReaderRef.current = new FileReader();
    } else {
      fileReaderRef.current.abort();
    }

    return fileReaderRef.current;
  });

  const api = useCreateConst(() => ({
    readAsText: (blob: Blob, encoding?: string) => {
      return new Promise<string>((resolve, reject) => {
        const reader = singleton();

        reader.onload = () => {
          if (typeof reader.result !== 'string') {
            reject(new Error('Failed to read file.'));
            return;
          }

          resolve(reader.result);
        };
        reader.onerror = () => reject(reader.error);

        reader.readAsText(blob, encoding);
      });
    },

    abort: () => {
      fileReaderRef.current?.abort();
    },
  }));

  useEffect(
    () => () => {
      if (!fileReaderRef.current) return;

      fileReaderRef.current.onload = null;
      fileReaderRef.current.onerror = null;
      fileReaderRef.current.abort();
    },
    []
  );

  return api;
};

export const useDropCSVFile = ({
  onDrop,
  onError,
}: {
  onDrop: (content: string) => void;
  onError: (error: string) => void;
}) => {
  const fileReader = useFileReader();

  const [dropProps, connectDrop] = useDrop<{ files: File[] }, unknown, { isOver: boolean }>({
    accept: NativeTypes.FILE,
    drop: async ({ files }) => {
      const csvFile = files.find((file) => file.type === MediaMimeType.TEXT_CSV);

      if (!csvFile) {
        onError('Unsupported file type.');
        return;
      }

      try {
        const csvContent = await fileReader.readAsText(csvFile);

        onDrop(csvContent);
      } catch {
        onError('Failed to read the file.');
      }
    },
    collect: (monitor) => ({ isOver: monitor.isOver() }),
  });

  useEffect(
    () => () => {
      connectDrop(null);
    },
    [connectDrop]
  );

  return [dropProps, connectDrop] as const;
};
