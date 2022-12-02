import * as Platform from '@voiceflow/platform-config';
import { useCallback, useContext } from 'react';

import { Permission } from '@/config/permissions';
import { ModalType } from '@/constants';
import { useEventualEngine, useModals, usePermission } from '@/hooks';

import { MarkupContext, PlatformContext } from '../contexts';
import { useCommentingMode } from './modes';

export * from './diagram';
export * from './modes';
export * from './tracking';

export const useIsPlatform = (platform: Platform.Constants.PlatformType) => {
  const activePlatform = useContext(PlatformContext);

  return platform === activePlatform;
};

export const useCommentingToggle = () => {
  const getEngine = useEventualEngine();
  const upgradeModal = useModals(ModalType.PAYMENT);
  const isCommentingMode = useCommentingMode();
  const [canUseCommenting] = usePermission(Permission.COMMENTING);

  return useCallback(() => {
    if (isCommentingMode) {
      getEngine()?.disableAllModes();
    } else if (!canUseCommenting) {
      upgradeModal.open();
    } else {
      getEngine()?.comment.activate();
    }
  }, [getEngine, upgradeModal, isCommentingMode]);
};

export const useDisableModes = () => {
  const markup = useContext(MarkupContext);
  const getEngine = useEventualEngine();

  return useCallback(() => {
    if (getEngine()?.markup.creatingType) {
      getEngine()?.markup.finishCreating?.();
    } else {
      getEngine()?.disableAllModes();
    }
  }, [markup]);
};
