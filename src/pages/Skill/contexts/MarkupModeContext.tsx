import React from 'react';

import { toast } from '@/components/Toast';
import { BlockType, MarkupModeType, MarkupShapeType } from '@/constants';
import { EventualEngineContext } from '@/contexts';
import { useDidUpdateEffect, useTrackingEvents, useUpload } from '@/hooks';
import { Markup, NodeData } from '@/models';
import { useMarkupMode } from '@/pages/Skill/hooks';
import { imageSizeFromUrl } from '@/utils/file';

const FILE_LIMIT = 2 ** 20 * 4; // 2 ** 20 === 1 mb
const ALLOWED_IMAGE_TYPES = ['.jpg', '.jpeg', '.png'].join(', ');

export type MarkupModeContextType = {
  modeType: MarkupModeType | MarkupShapeType | null;
  isCreating: boolean;
  onAddImage: () => void;
  setModeType: (value: MarkupModeType | MarkupShapeType | null) => void;
  finishCreating: () => void;
  isUploadingImage: boolean;
  setCreatingModeType: (value: MarkupModeType | MarkupShapeType | null) => void;
};

export const MarkupModeContext = React.createContext<MarkupModeContextType | null>(null);
export const { Consumer: MarkupModeConsumer } = MarkupModeContext;

export const MarkupModeProvider: React.FC = ({ children }) => {
  const startTimeCache = React.useRef(0);
  const [modeType, setModeType] = React.useState<MarkupModeType | MarkupShapeType | null>(null);
  const [isCreating, setCreating] = React.useState(false);
  const eventualEngine = React.useContext(EventualEngineContext)!;
  const isMarkupMode = useMarkupMode();

  const { isLoading: isUploadingImage, onUpload } = useUpload({
    fileType: 'image',
    clientFunc: 'uploadImage',
  });

  const [trackEvents] = useTrackingEvents();

  const setCreatingModeType = (type: null | MarkupModeType | MarkupShapeType) => {
    setModeType(type);
    setCreating(!!type);

    if (type) {
      eventualEngine.get()?.canvas?.setBusy(true);
    } else {
      eventualEngine.get()?.canvas?.setBusy(false);
    }
  };

  const finishCreating = () => setCreatingModeType(null);

  // TODO: we should probably move these to the markup engine / manager
  const onAddImage = () => {
    setCreatingModeType(null);

    const input = document.createElement('input');

    const listener = async (event: Event) => {
      // eslint-disable-next-line xss/no-mixed-html
      const file = (event.currentTarget as HTMLInputElement).files?.[0];

      if (!file) return;

      if (file.size > FILE_LIMIT) {
        toast.error('The file must be less then 4MB');
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

        const nodeData: Markup.NodeData.Image = { url: imageURL, width: imageSize.width, height: imageSize.height, rotate: 0 };

        engine.node.add(BlockType.MARKUP_IMAGE, engine.canvas!.toCoords([offsetX, offsetY]), nodeData as NodeData<Markup.NodeData.Image>);
      } catch {
        toast.error('There was an error');
      }

      setModeType(null);
    };

    input.type = 'file';
    input.accept = ALLOWED_IMAGE_TYPES;

    input.addEventListener('change', listener, { once: true });

    input.click();
  };

  const trackMarkupTime = React.useCallback(() => {
    if (startTimeCache.current) {
      trackEvents.trackMarkupSessionDuration({ duration: Date.now() - startTimeCache.current });
      startTimeCache.current = 0;
    }
  }, []);

  React.useEffect(() => {
    window.addEventListener('beforeunload', trackMarkupTime);

    return () => {
      trackMarkupTime();
      window.removeEventListener('beforeunload', trackMarkupTime);
    };
  }, []);

  useDidUpdateEffect(() => {
    if (isMarkupMode) {
      eventualEngine.get()?.clearActivation();

      trackEvents.trackMarkupOpen();
      setCreatingModeType(MarkupModeType.TEXT);

      startTimeCache.current = Date.now();
    } else {
      eventualEngine.get()?.clearActivation();
      eventualEngine.get()?.markup.reset();

      setCreatingModeType(null);

      setCreating(false);
      trackMarkupTime();
    }
  }, [isMarkupMode]);

  return (
    <MarkupModeContext.Provider
      value={{
        modeType,
        onAddImage,
        isCreating,
        setModeType,
        finishCreating,
        isUploadingImage,
        setCreatingModeType,
      }}
    >
      {children}
    </MarkupModeContext.Provider>
  );
};
