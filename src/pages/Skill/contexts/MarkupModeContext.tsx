import React from 'react';

import { toast } from '@/components/Toast';
import { BlockType, MarkupModeType } from '@/constants';
import { useDidUpdateEffect, useEventualEngine, useTrackingEvents, useUpload } from '@/hooks';
import { Markup, NodeData } from '@/models';
import { useMarkupMode } from '@/pages/Skill/hooks';
import { imageSizeFromUrl } from '@/utils/file';

const FILE_LIMIT = 2 ** 20 * 4; // 2 ** 20 === 1 mb
const ALLOWED_IMAGE_TYPES = ['.jpg', '.jpeg', '.png'].join(', ');

export type MarkupModeContextType = {
  modeType: MarkupModeType | null;
  isCreating: boolean;
  onAddImage: () => void;
  setModeType: (value: MarkupModeType | null) => void;
  finishCreating: () => void;
  isUploadingImage: boolean;
  setCreatingModeType: (value: MarkupModeType | null) => void;
};

export const MarkupModeContext = React.createContext<MarkupModeContextType | null>(null);
export const { Consumer: MarkupModeConsumer } = MarkupModeContext;

export const MarkupModeProvider: React.FC = ({ children }) => {
  const startTimeCache = React.useRef(0);
  const [modeType, setModeType] = React.useState<MarkupModeType | null>(null);
  const [isCreating, setCreating] = React.useState(false);
  const getEngine = useEventualEngine();
  const isMarkupMode = useMarkupMode();

  const { isLoading: isUploadingImage, onUpload } = useUpload({
    fileType: 'image',
    clientFunc: 'uploadImage',
  });

  const [trackEvents] = useTrackingEvents();

  const onSetModeType = React.useCallback(
    (type: MarkupModeType | null) => {
      getEngine()?.markup.setModeTypeAndCreating(type, isCreating);

      setModeType(type);
    },
    [getEngine]
  );

  const setCreatingModeType = React.useCallback(
    (type: MarkupModeType | null) => {
      const engine = getEngine();
      const isNextCreating = !!type;

      engine?.canvas?.setBusy(isNextCreating);
      engine?.markup.setModeTypeAndCreating(type, isNextCreating);

      setModeType(type);
      setCreating(isNextCreating);
    },
    [getEngine]
  );

  const finishCreating = React.useCallback(() => setCreatingModeType(null), [setCreatingModeType]);
  getEngine()?.markup.setFinishCreating(finishCreating);

  // TODO: we should probably move these to the markup engine / manager
  const onAddImage = React.useCallback(() => {
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
        onSetModeType(MarkupModeType.IMAGE);

        const engine = getEngine()!;

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

      onSetModeType(null);
    };

    input.type = 'file';
    input.accept = ALLOWED_IMAGE_TYPES;

    input.addEventListener('change', listener, { once: true });

    input.click();
  }, [getEngine, setCreatingModeType, onSetModeType, onUpload]);

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
    const engine = getEngine();

    if (isMarkupMode) {
      const hasFocus = engine?.markup.hasFocus;
      if (!hasFocus) {
        engine?.clearActivation();
      }

      trackEvents.trackMarkupOpen();
      if (!hasFocus) {
        setCreatingModeType(MarkupModeType.TEXT);
      }

      startTimeCache.current = Date.now();
    } else {
      engine?.clearActivation();
      engine?.markup.reset();

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
        setModeType: onSetModeType,
        finishCreating,
        isUploadingImage,
        setCreatingModeType,
      }}
    >
      {children}
    </MarkupModeContext.Provider>
  );
};
