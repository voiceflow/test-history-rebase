import * as Platform from '@voiceflow/platform-config';
import { useCallback, useContext } from 'react';

import { Permission } from '@/constants/permissions';
import { useActiveProjectPlatform, usePermission } from '@/hooks';
import { useEventualEngine } from '@/hooks/engine.hook';
import { usePaymentModal } from '@/hooks/modal.hook';

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
  const paymentModal = usePaymentModal();
  const isCommentingMode = useCommentingMode();
  const [canUseCommenting] = usePermission(Permission.PROJECT_COMMENT);

  return useCallback(() => {
    if (isCommentingMode) {
      getEngine()?.disableAllModes();
    } else if (!canUseCommenting) {
      paymentModal.openVoid({});
    } else {
      getEngine()?.comment.activate();
    }
  }, [getEngine, paymentModal.openVoid, isCommentingMode]);
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
