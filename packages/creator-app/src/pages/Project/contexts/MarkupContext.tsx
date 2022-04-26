import { Nullable, Utils } from '@voiceflow/common';
import { toast, useCache, useContextApi, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/config/permissions';
import { BlockType, MarkupBlockType } from '@/constants';
import { useEventualEngine, usePermission, useTrackingEvents, useUpload } from '@/hooks';
import { useAnyModeOpen } from '@/pages/Project/hooks/modes';
import { ClassName, Identifier } from '@/styles/constants';
import { upload, windowRefocused } from '@/utils/dom';
import { imageSizeFromUrl } from '@/utils/file';

const FILE_LIMIT = 2 ** 20 * 4; // 2 ** 20 === 1 mb
const ALLOWED_IMAGE_TYPES = ['.jpg', '.jpeg', '.png'];

export interface MarkupContextType {
  imageLimit: number;
  creatingType: Nullable<MarkupBlockType>;
  uploadingImages: boolean;
  imageAcceptedTypes: string[];

  addImages: (files: Nullable<FileList | File[]>) => Promise<void>;
  finishCreating: () => void;
  startTextCreation: () => void;
  toggleTextCreating: () => void;
  triggerImagesUpload: () => void;
}

export const MarkupContext = React.createContext<Nullable<MarkupContextType>>(null);
export const { Consumer: MarkupConsumer } = MarkupContext;

export const MarkupProvider: React.FC = ({ children }) => {
  const getEngine = useEventualEngine();
  const isAnyModeOpen = useAnyModeOpen();
  const [canEditCanvas] = usePermission(Permission.EDIT_CANVAS);
  const [creatingType, localSetCreatingType] = React.useState<Nullable<MarkupBlockType>>(null);
  const [uploadingImages, setUploadingImages] = React.useState(false);

  const { onUpload: onUploadImage, isLoading: isImageUploading } = useUpload({ fileType: 'image', clientFunc: 'uploadImage' });

  const cache = useCache({ getEngine, isAnyModeOpen, canEditCanvas, isImageUploading, uploadingImages });

  const [trackEvents] = useTrackingEvents();

  const setCreatingType = React.useCallback((type: Nullable<MarkupBlockType>) => {
    const engine = cache.current.getEngine();
    const isNextCreating = !!type;

    engine?.canvas?.setBusy(isNextCreating);
    engine?.markup.setCreatingType(type);

    localSetCreatingType(type);
  }, []);

  const finishCreating = React.useCallback(() => setCreatingType(null), []);

  const addImages = React.useCallback(async (files: Nullable<FileList | File[]>) => {
    if (!cache.current.canEditCanvas || !files || !files[0]) {
      return;
    }

    trackEvents.trackMarkupImage();

    const allowedFiles = Array.from(files).filter((file) => ALLOWED_IMAGE_TYPES.includes(`.${file.type.split('/')[1]}`) && file.size <= FILE_LIMIT);

    if (!allowedFiles.length) {
      toast.error('The file must be less then 4MB');
      return;
    }

    setCreatingType(BlockType.MARKUP_IMAGE);
    setUploadingImages(true);

    const engine = cache.current.getEngine()!;

    await Utils.array.asyncForEach(allowedFiles, async (file) => {
      if (!engine.canvas) return;

      try {
        const imageURL = await onUploadImage(null, file);
        const imageSize = await imageSizeFromUrl(imageURL);

        const rect = engine.canvas.getRect();
        const zoom = engine.canvas.getZoom();
        const [x, y] = engine.canvas.getPosition();
        const offsetX = 0 - x / zoom + (rect.width / zoom - imageSize.width) / 2;
        const offsetY = 0 - y / zoom + (rect.height / zoom - imageSize.height) / 2;

        await engine.node.add(BlockType.MARKUP_IMAGE, engine.canvas.toCoords([offsetX, offsetY]), {
          url: imageURL,
          width: imageSize.width,
          height: imageSize.height,
          rotate: 0,
        });
      } catch {
        toast.error('There was an error');
      }
    });

    setCreatingType(null);
    setUploadingImages(false);
  }, []);

  const startTextCreation = React.useCallback(() => {
    if (!cache.current.canEditCanvas) {
      return;
    }

    if (cache.current.isAnyModeOpen) {
      cache.current.getEngine()?.disableAllModes();
    }

    setCreatingType(BlockType.MARKUP_TEXT);
  }, []);

  const toggleTextCreating = React.useCallback(() => {
    if (creatingType) {
      finishCreating();
    } else {
      startTextCreation();
    }
  }, [creatingType, finishCreating, startTextCreation]);

  const triggerImagesUpload = React.useCallback(async () => {
    if (!cache.current.canEditCanvas || cache.current.isImageUploading) {
      return;
    }

    if (cache.current.isAnyModeOpen) {
      cache.current.getEngine()?.disableAllModes();
    }

    setCreatingType(BlockType.MARKUP_IMAGE);

    upload(addImages, { multiple: true, accept: ALLOWED_IMAGE_TYPES.join(',') });

    await windowRefocused();
    await Utils.promise.delay(300);

    if (!cache.current.uploadingImages) {
      setCreatingType(null);
    }
  }, []);

  useDidUpdateEffect(() => {
    if (!creatingType) {
      getEngine()?.markup.reset();
    }
  }, [creatingType]);

  React.useEffect(() => {
    if (creatingType === BlockType.MARKUP_TEXT) {
      const handler = (event: MouseEvent) => {
        // eslint-disable-next-line xss/no-mixed-html
        const target = event.target as HTMLElement | SVGElement;

        // not using .className cause in the SVGElement it can be SVGAnimatedString
        const className = target.getAttribute('class') ?? '';

        // do not finish creating if clicked to the canvas or markup node
        if (
          target.id === Identifier.CANVAS ||
          className.includes(`${ClassName.CANVAS_NODE}--${BlockType.MARKUP_TEXT}`) ||
          target.closest(`${ClassName.CANVAS_NODE}--${BlockType.MARKUP_TEXT}`) ||
          className.includes(`${ClassName.CANVAS_NODE}--${BlockType.MARKUP_IMAGE}`) ||
          target.closest(`${ClassName.CANVAS_NODE}--${BlockType.MARKUP_IMAGE}`)
        ) {
          return;
        }

        finishCreating();
      };

      window.document.addEventListener('mouseup', handler);
      window.document.addEventListener('mousedown', handler);

      return () => {
        window.document.removeEventListener('mouseup', handler);
        window.document.removeEventListener('mousedown', handler);
      };
    }

    return () => {};
  }, [creatingType]);

  getEngine()?.markup.setFinishCreating(finishCreating);

  const api = useContextApi({
    addImages,
    imageLimit: FILE_LIMIT,
    creatingType,
    finishCreating,
    uploadingImages,
    startTextCreation,
    imageAcceptedTypes: ALLOWED_IMAGE_TYPES,
    toggleTextCreating,
    triggerImagesUpload,
  });

  return <MarkupContext.Provider value={api}>{children}</MarkupContext.Provider>;
};
