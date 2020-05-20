import React from 'react';

import { toast } from '@/components/Toast';
import { BlockType, MarkupModeType } from '@/constants';
import { EventualEngineContext } from '@/contexts';
import { useEnableDisable, useTrackingEvents, useUpload } from '@/hooks';
import { Markup, NodeData } from '@/models';
import { imageSizeFromUrl } from '@/utils/file';

export type MarkupModeContextType = {
  isOpen: boolean;
  openTool: () => void;
  modeType: MarkupModeType | null;
  closeTool: () => void;
  onAddImage: () => void;
  setModeType: (value: MarkupModeType | null) => void;
  isUploadingImage: boolean;
};

export const MarkupModeContext = React.createContext<MarkupModeContextType | null>(null);
export const { Consumer: MarkupModeConsumer } = MarkupModeContext;

const FILE_LIMIT = 2 ** 20 * 10; // 2 ** 20 === 1 mb

export const MarkupModeProvider: React.FC = ({ children }) => {
  const [modeType, setModeType] = React.useState<MarkupModeType | null>(null);
  const [isOpen, openTool, closeTool] = useEnableDisable(false);
  const eventualEngine = React.useContext(EventualEngineContext)!;

  const { isLoading: isUploadingImage, onUpload } = useUpload({
    fileType: 'image',
    clientFunc: 'uploadImage',
  });

  const [trackEvents] = useTrackingEvents();

  const startTimeCache = React.useRef(0);
  const isOpenCache = React.useRef(isOpen);

  isOpenCache.current = isOpen;

  const onAddImage = () => {
    const input = document.createElement('input');

    const listener = async (e: Event) => {
      // eslint-disable-next-line xss/no-mixed-html
      const file = (e.currentTarget as HTMLInputElement).files?.[0];

      if (!file) {
        return;
      }

      if (file.size > FILE_LIMIT) {
        toast.error('The file must be less then 10MB');
        return;
      }

      try {
        setModeType(MarkupModeType.IMAGE);

        const engine = eventualEngine.get()!;

        const imageURL = await onUpload(null, file);
        const imageSize = await imageSizeFromUrl(imageURL);

        const rect = engine.canvas!.getRect();
        const zoom = engine.canvas!.getZoom();
        const [x, y] = engine.canvas!.getPosition();
        const offsetX = 0 - x / zoom + (rect.width / zoom - imageSize.width) / 2;
        const offsetY = 0 - y / zoom + (rect.height / zoom - imageSize.height) / 2;

        const nodeData: Markup.ImageNodeData = { url: imageURL, width: imageSize.width, height: imageSize.height };

        engine.node.add(BlockType.MARKUP_IMAGE, [offsetX, offsetY], nodeData as NodeData<Markup.ImageNodeData>);
      } catch {
        toast.error('There was an error');
      }

      setModeType(null);
    };

    input.type = 'file';
    input.accept = '.jpg, .jpeg, .png';

    input.addEventListener('change', listener, { once: true });

    input.click();
  };

  const trackMarkupTime = React.useCallback(() => {
    if (startTimeCache.current) {
      trackEvents.trackMarkupSessionDuration({ duration: Date.now() - startTimeCache.current });
      startTimeCache.current = 0;
    }
  }, []);

  const onEnableMarkup = React.useCallback(() => {
    if (isOpenCache.current) {
      return;
    }

    openTool();
    trackEvents.trackMarkupOpen();

    startTimeCache.current = Date.now();
  }, []);

  const onDisableMarkup = React.useCallback(() => {
    if (!isOpenCache.current) {
      return;
    }

    trackMarkupTime();
    closeTool();
  }, []);

  React.useEffect(() => {
    window.addEventListener('beforeunload', trackMarkupTime);

    return () => {
      trackMarkupTime();
      window.removeEventListener('beforeunload', trackMarkupTime);
    };
  }, []);

  return (
    <MarkupModeContext.Provider
      value={{ isOpen, openTool: onEnableMarkup, closeTool: onDisableMarkup, modeType, setModeType, onAddImage, isUploadingImage }}
    >
      {children}
    </MarkupModeContext.Provider>
  );
};
