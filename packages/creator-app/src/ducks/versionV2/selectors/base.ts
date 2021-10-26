import * as Feature from '@/ducks/feature';
import { createCRUDSelectors, idParamSelector } from '@/ducks/utils/crudV2';
import * as VersionSelectorsV1 from '@/ducks/version/selectors';

import { STATE_KEY } from '../constants';

const { byID: _versionByIDSelector, getByID: _getVersionByIDSelector } = createCRUDSelectors(STATE_KEY);

export const versionByIDSelector = Feature.createAtomicActionsSelector(
  [VersionSelectorsV1.versionByIDSelector, _versionByIDSelector, idParamSelector],
  (getVersionV1, versionV2, versionID) => [versionID ? getVersionV1(versionID) : null, versionV2]
);

export const getVersionByIDSelector = Feature.createAtomicActionsSelector([VersionSelectorsV1.versionByIDSelector, _getVersionByIDSelector]);
