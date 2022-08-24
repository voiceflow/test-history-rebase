import { Nullable, Utils } from '@voiceflow/common';
import { toast, Upload, useCache, useContextApi, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';

import { Permission } from '@/config/permissions';
import { LimitType } from '@/config/planLimitV2';
import { BlockType, MarkupBlockType } from '@/constants';
import * as History from '@/ducks/history';
import { useDispatch, useEventualEngine, useLimit, usePermission, useTrackingEvents } from '@/hooks';
import { useAnyModeOpen } from '@/pages/Project/hooks/modes';
import { ClassName, Identifier } from '@/styles/constants';
import { upload, windowRefocused } from '@/utils/dom';
import { imageSizeFromUrl, videoSizeFromUrl } from '@/utils/file';

const MB = 2 ** 20; // 2 ** 20 === 1 mb
const ALLOWED_IMAGE_TYPES = ['.jpg', '.jpeg', '.png'];
const ALLOWED_VIDEOS_TYPES = ['.mp4', '.mpeg4', '.webm'];

export interface MarkupContextType {
  creatingType: Nullable<MarkupBlockType>;
  uploadingMedia: boolean;
  imageAcceptedTypes: string[];

  addMedia: (files: Nullable<FileList | File[]>) => Promise<void>;
  finishCreating: () => void;
  startTextCreation: () => void;
  toggleTextCreating: () => void;
  triggerMediaUpload: () => void;
}

export const MarkupContext = React.createContext<Nullable<MarkupContextType>>(null);
export const { Consumer: MarkupConsumer } = MarkupContext;

const getFileExtension = (file: File) => `.${file.type.split('/')[1]}`;

export const MarkupProvider: React.FC = ({ children }) => {
  const getEngine = useEventualEngine();
  const isAnyModeOpen = useAnyModeOpen();
  const [canEditCanvas] = usePermission(Permission.EDIT_CANVAS);
  const [uploadingMedia, setUploadingMedia] = React.useState(false);
  const [creatingType, localSetCreatingType] = React.useState<Nullable<MarkupBlockType>>(null);

  const markupVideoLimit = useLimit(LimitType.MARKUP_VIDEO);
  const markupImageLimit = useLimit(LimitType.MARKUP_IMAGE);

  const imageUploader = Upload.useUpload({ fileType: 'image', endpoint: '/image' });
  const videoUploader = Upload.useUpload({ fileType: 'video', endpoint: '/video' });

  const cache = useCache({
    getEngine,
    isAnyModeOpen,
    canEditCanvas,
    uploadingMedia,
    markupVideoLimit,
    markupImageLimit,
    isMediaUploading: imageUploader.isLoading || videoUploader.isLoading,
  });

  const transaction = useDispatch(History.transaction);

  const [trackEvents] = useTrackingEvents();

  const setCreatingType = React.useCallback((type: Nullable<MarkupBlockType>) => {
    const engine = cache.current.getEngine();
    const isNextCreating = !!type;

    engine?.canvas?.setBusy(isNextCreating);
    engine?.markup.setCreatingType(type);

    localSetCreatingType(type);
  }, []);

  const finishCreating = React.useCallback(() => setCreatingType(null), []);

  const addMedia = React.useCallback(async (files: Nullable<FileList | File[]>) => {
    if (!cache.current.canEditCanvas || !files || !files[0]) {
      return;
    }

    trackEvents.trackMarkupImage();

    const errors: React.ReactNode[] = [];

    const allowedFiles = Array.from(files).filter((file) => {
      const extension = getFileExtension(file);

      const fileSizeMB = file.size / MB;

      if (ALLOWED_IMAGE_TYPES.includes(extension)) {
        if (cache.current.markupImageLimit && fileSizeMB > cache.current.markupImageLimit.value) {
          errors.push(cache.current.markupImageLimit.error);
          return false;
        }

        return true;
      }

      if (ALLOWED_VIDEOS_TYPES.includes(extension)) {
        if (cache.current.markupVideoLimit && fileSizeMB > cache.current.markupVideoLimit.value) {
          errors.push(cache.current.markupVideoLimit.error);
          return false;
        }

        return true;
      }

      return false;
    });

    if (!allowedFiles.length) {
      if (errors.length) {
        toast.error(errors[0]);
      } else {
        toast.error(`Unsupported file type, please upload ${[...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEOS_TYPES].join(', ')}`);
      }

      return;
    }

    setCreatingType(BlockType.MARKUP_IMAGE);
    setUploadingMedia(true);

    const engine = cache.current.getEngine()!;

    const uploadVideo = async (file: File) => {
      videoUploader.loadingOn();

      const url = await videoUploader.onUpload('/video', file);
      const size = await videoSizeFromUrl(url);

      videoUploader.loadingOff();

      return { url, size };
    };

    const uploadImage = async (file: File) => {
      imageUploader.loadingOn();

      const url = await imageUploader.onUpload('/image', file);
      const size = await imageSizeFromUrl(url);

      imageUploader.loadingOff();

      return { url, size };
    };

    await transaction(() =>
      Utils.array.asyncForEach(allowedFiles, async (file) => {
        if (!engine.canvas) return;

        const isImage = ALLOWED_IMAGE_TYPES.includes(getFileExtension(file));

        try {
          const { url, size } = isImage ? await uploadImage(file) : await uploadVideo(file);

          const rect = engine.canvas.getRect();
          const zoom = engine.canvas.getZoom();
          const [x, y] = engine.canvas.getPosition();
          const offsetX = 0 - x / zoom + (rect.width / zoom - size.width) / 2;
          const offsetY = 0 - y / zoom + (rect.height / zoom - size.height) / 2;

          await engine.node.add(isImage ? BlockType.MARKUP_IMAGE : BlockType.MARKUP_VIDEO, engine.canvas.toCoords([offsetX, offsetY]), {
            url,
            width: size.width,
            height: size.height,
            rotate: 0,
          });
        } catch {
          toast.error('There was an error');
        }
      })
    );

    setCreatingType(null);
    setUploadingMedia(false);
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

  const triggerMediaUpload = React.useCallback(async () => {
    if (!cache.current.canEditCanvas || cache.current.isMediaUploading) {
      return;
    }

    if (cache.current.isAnyModeOpen) {
      cache.current.getEngine()?.disableAllModes();
    }

    setCreatingType(BlockType.MARKUP_IMAGE);

    upload(addMedia, { multiple: true, accept: [...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEOS_TYPES].join(',') });

    await windowRefocused();
    await Utils.promise.delay(300);

    if (!cache.current.uploadingMedia) {
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
    addMedia,
    creatingType,
    finishCreating,
    uploadingMedia,
    startTextCreation,
    imageAcceptedTypes: ALLOWED_IMAGE_TYPES,
    toggleTextCreating,
    triggerMediaUpload,
  });

  return <MarkupContext.Provider value={api}>{children}</MarkupContext.Provider>;
};
