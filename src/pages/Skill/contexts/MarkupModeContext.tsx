import React from 'react';

import { toast } from '@/components/Toast';
import { BlockType, MarkupModeType, MarkupShapeType } from '@/constants';
import { EventualEngineContext } from '@/contexts';
import { useEnableDisable, useTrackingEvents, useUpload } from '@/hooks';
import { Markup, NodeData } from '@/models';
import { CANVAS_MARKUP_CREATING_CLASSNAME } from '@/pages/Canvas/constants';
import { imageSizeFromUrl } from '@/utils/file';

const FILE_LIMIT = 2 ** 20 * 4; // 2 ** 20 === 1 mb
const ALLOWED_IMAGE_TYPES = ['.jpg', '.jpeg', '.png'].join(', ');

export type MarkupModeContextType = {
  isOpen: boolean;
  openTool: () => void;
  modeType: MarkupModeType | MarkupShapeType | null;
  closeTool: () => void;
  isCreating: boolean;
  onAddImage: () => void;
  setModeType: (value: MarkupModeType | MarkupShapeType | null) => void;
  finishCreating: (keepOpen?: boolean) => void;
  isUploadingImage: boolean;
  setCreatingModeType: (value: MarkupModeType | MarkupShapeType | null) => void;
};

export const MarkupModeContext = React.createContext<MarkupModeContextType | null>(null);
export const { Consumer: MarkupModeConsumer } = MarkupModeContext;

export const MarkupModeProvider: React.FC = ({ children }) => {
  const [modeType, setModeType] = React.useState<MarkupModeType | MarkupShapeType | null>(null);
  const [isCreating, setCreating] = React.useState(false);
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

  const setCreatingModeType = (type: null | MarkupModeType | MarkupShapeType, keepOpen?: boolean) => {
    setModeType(type);
    setCreating(!!type);

    if (!keepOpen) {
      eventualEngine.get()?.focus.reset();
    }

    if (type) {
      eventualEngine.get()?.canvas?.addClass(CANVAS_MARKUP_CREATING_CLASSNAME);
      eventualEngine.get()?.canvas?.setBusy(true);
    } else {
      eventualEngine.get()?.canvas?.removeClass(CANVAS_MARKUP_CREATING_CLASSNAME);
      eventualEngine.get()?.canvas?.setBusy(false);
    }
  };

  const finishCreating = (keepOpen?: boolean) => setCreatingModeType(null, keepOpen);

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

        engine.node.add(BlockType.MARKUP_IMAGE, [offsetX, offsetY], nodeData as NodeData<Markup.NodeData.Image>);
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

  const onEnableMarkup = React.useCallback(() => {
    if (isOpenCache.current) {
      return;
    }

    eventualEngine.get()?.clearActivation();
    eventualEngine.get()?.markup.enable();

    openTool();

    trackEvents.trackMarkupOpen();

    startTimeCache.current = Date.now();
  }, []);

  const onDisableMarkup = React.useCallback(() => {
    if (!isOpenCache.current) return;

    setCreatingModeType(null);

    eventualEngine.get()?.markup.disable();

    setCreating(false);
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
      value={{
        isOpen,
        modeType,
        openTool: onEnableMarkup,
        closeTool: onDisableMarkup,
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
