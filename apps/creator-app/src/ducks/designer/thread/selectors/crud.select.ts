import { FeatureFlag } from '@voiceflow/realtime-sdk';

import { featureSelectorFactory } from '@/ducks/feature';
import * as ThreadLegacySelectors from '@/ducks/threadV2/selectors';

import { createDesignerCRUDSelectors } from '../../utils';
import { root } from './root.select';

const crud = createDesignerCRUDSelectors(root);

export const { map, keys, count, isEmpty, allByIDs, hasOneByID, oneByID, hasAllByIDs, getAllByIDs } = crud;

export const all = featureSelectorFactory(FeatureFlag.THREAD_COMMENTS)(ThreadLegacySelectors.allThreadsSelector, crud.all);

export const getOneByID = featureSelectorFactory(FeatureFlag.THREAD_COMMENTS)(ThreadLegacySelectors.getThreadByIDSelector, crud.getOneByID);
