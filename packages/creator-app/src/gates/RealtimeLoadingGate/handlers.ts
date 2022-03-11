import { Eventual } from '@voiceflow/common';

import { FeatureFlag } from '@/config/features';
import * as Feature from '@/ducks/feature';
import * as RealtimeDuck from '@/ducks/realtime';
import { ActionPayload, AnyAction, Dispatch, GetState } from '@/store/types';

// eslint-disable-next-line import/prefer-default-export
export const createHandlers = (dispatch: Dispatch, getState: GetState) => {
  const wrapHandler =
    <T>(handler: (payload: T, tabID: string) => void, feature: FeatureFlag) =>
    (payload: T, tabID: string) => {
      const isAtomicActions = Feature.isFeatureEnabledSelector(getState())(feature);

      if (!isAtomicActions) {
        handler(payload, tabID);
      }
    };

  return {
    [RealtimeDuck.SocketAction.LOCK_RESOURCE]: wrapHandler<ActionPayload<RealtimeDuck.LockResource>>(
      ({ targets: [resourceID] }, tabID) => dispatch(RealtimeDuck.addResourceLock(resourceID, tabID)),
      FeatureFlag.ATOMIC_ACTIONS_PHASE_2
    ),
    [RealtimeDuck.SocketAction.UNLOCK_RESOURCE]: wrapHandler<ActionPayload<RealtimeDuck.UnlockResource>>(
      ({ targets: [resourceID] }) => dispatch(RealtimeDuck.removeResourceLock(resourceID)),
      FeatureFlag.ATOMIC_ACTIONS_PHASE_2
    ),
  } as Record<string, (payload: any, tabID: string) => Eventual<void> | AnyAction>;
};
