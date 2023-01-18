import * as Platform from '@voiceflow/platform-config';
import { useCallback, useContext } from 'react';

import { ModalType } from '@/constants';
import { Permission } from '@/constants/permissions';
import { useActiveProjectPlatform, useEventualEngine, useModals, usePermission } from '@/hooks';

import { MarkupContext } from '../contexts';
import { useCommentingMode } from './modes';

export * from './diagram';
export * from './modes';
export * from './tracking';

export const useIsPlatform = (platform: Platform.Constants.PlatformType) => {
  const activePlatform = useActiveProjectPlatform();

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
