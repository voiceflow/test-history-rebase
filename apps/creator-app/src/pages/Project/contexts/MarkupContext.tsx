import type { Nullable } from '@voiceflow/common';
import { Utils } from '@voiceflow/common';
import type { MarkupBlockType } from '@voiceflow/realtime-sdk';
import { BlockType } from '@voiceflow/realtime-sdk';
import { toast, Upload, useCache, useContextApi, useDidUpdateEffect } from '@voiceflow/ui';
import React from 'react';

import { LimitType } from '@/constants/limits';
import { Permission } from '@/constants/permissions';
import * as History from '@/ducks/history';
import * as Organization from '@/ducks/organization';
import {
  useDispatch,
  useEventualEngine,
  usePermission,
  usePlanLimitConfig,
  useSelector,
  useTrackingEvents,
} from '@/hooks';
import { useLimitConfig } from '@/hooks/planLimitV3';
import { useAnyModeOpen, useTextMarkupMode } from '@/pages/Project/hooks/modes';
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

export const MarkupProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const getEngine = useEventualEngine();
  const isAnyModeOpen = useAnyModeOpen();
  const isTextMarkupMode = useTextMarkupMode();
  const [canEditCanvas] = usePermission(Permission.CANVAS_EDIT);
  const [uploadingMedia, setUploadingMedia] = React.useState(false);
  const [creatingType, localSetCreatingType] = React.useState<Nullable<MarkupBlockType>>(
    isTextMarkupMode ? BlockType.MARKUP_TEXT : null
  );
  const subscription = useSelector(Organization.chargebeeSubscriptionSelector);

  const legacyVideoLimitConfig = usePlanLimitConfig(LimitType.MARKUP_VIDEO);
  const legacyImageLimitConfig = usePlanLimitConfig(LimitType.MARKUP_IMAGE);

  const newVideoLimitConfig = useLimitConfig(LimitType.MARKUP_VIDEO);
  const newImageLimitConfig = useLimitConfig(LimitType.MARKUP_IMAGE);

  const videoLimitConfig = subscription ? newVideoLimitConfig : legacyVideoLimitConfig;
  const imageLimitConfig = subscription ? newImageLimitConfig : legacyImageLimitConfig;

  const imageUploader = Upload.useUpload({ fileType: 'image', endpoint: '/image' });
  const videoUploader = Upload.useUpload({ fileType: 'video', endpoint: '/video' });

  const cache = useCache({
    getEngine,
    isAnyModeOpen,
    canEditCanvas,
    uploadingMedia,
    videoLimitConfig,
    imageLimitConfig,
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

  const finishCreating = React.useCallback(() => {
    setCreatingType(null);
    cache.current.getEngine()?.disableAllModes();
  }, []);

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
        if (cache.current.imageLimitConfig && fileSizeMB > cache.current.imageLimitConfig.limit) {
          errors.push(cache.current.imageLimitConfig.toastError(cache.current.imageLimitConfig.payload));
          return false;
        }

        return true;
      }

      if (ALLOWED_VIDEOS_TYPES.includes(extension)) {
        if (cache.current.videoLimitConfig && fileSizeMB > cache.current.videoLimitConfig.limit) {
          errors.push(cache.current.videoLimitConfig.toastError(cache.current.videoLimitConfig.payload));
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
        toast.error(
          `Unsupported file type, please upload ${[...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEOS_TYPES].join(', ')}`
        );
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

          await engine.node.add({
            type: isImage ? BlockType.MARKUP_IMAGE : BlockType.MARKUP_VIDEO,
            coords: engine.canvas.toCoords([offsetX, offsetY]),
            factoryData: {
              url,
              width: size.width,
              height: size.height,
              rotate: 0,
            },
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
    cache.current.getEngine()?.markup.activate();
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
