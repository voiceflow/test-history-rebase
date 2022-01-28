import * as Feature from '@/ducks/feature';
import { createCurriedSelector } from '@/ducks/utils';
import { createCRUDSelectors, idParamSelector } from '@/ducks/utils/crudV2';
import * as VersionSelectorsV1 from '@/ducks/version/selectors';

import { STATE_KEY } from '../constants';

const { byID: _versionByIDSelector } = createCRUDSelectors(STATE_KEY);

export const versionByIDSelector = Feature.createAtomicActionsSelector(
  [VersionSelectorsV1.versionByIDSelector, _versionByIDSelector, idParamSelector],
  (getVersionV1, versionV2, versionID) => [versionID ? getVersionV1(versionID) : null, versionV2]
);

export const getVersionByIDSelector = createCurriedSelector(versionByIDSelector);
