import type { Nullable } from '@voiceflow/common';
import type * as Platform from '@voiceflow/platform-config';
import { createSelector } from 'reselect';

import * as Session from '@/ducks/session';

import { getVersionByIDSelector } from '../base';

/**
 *  Should be used only in platform specific selectors
 */
export const platformSelectorsFactory = <Version extends Platform.Base.Models.Version.Model>() => {
  const versionSelector = createSelector(
    [Session.activeVersionIDSelector, getVersionByIDSelector],
    (versionID, getVersion) => getVersion({ id: versionID }) as Nullable<Version>
  );

  return {
    versionSelector,
    sessionSelector: createSelector(
      [versionSelector],
      (version): Nullable<Version['session']> => version?.session ?? null
    ),
    settingsSelector: createSelector(
      [versionSelector],
      (version): Nullable<Version['settings']> => version?.settings ?? null
    ),
    publishingSelector: createSelector(
      [versionSelector],
      (version): Nullable<Version['publishing']> => version?.publishing ?? null
    ),
  };
};
