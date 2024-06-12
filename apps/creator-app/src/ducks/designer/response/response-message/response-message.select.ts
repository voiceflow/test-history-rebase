import { createSelector } from 'reselect';

import { createSubSelector } from '@/ducks/utils/selector';
import { sortCreatableCMSResources } from '@/utils/cms.util';

import { createDesignerCRUDSelectors, responseDiscriminatorIDParamSelector } from '../../utils/selector.util';
import { root as responseRoot } from '../selectors/root.select';
import { STATE_KEY } from './response-message.state';

const root = createSubSelector(responseRoot, STATE_KEY);

export const { hasOneByID, hasAllByIDs, oneByID, getOneByID, allByIDs, getAllByIDs, all, map, count, isEmpty } =
  createDesignerCRUDSelectors(root);

export const allByDiscriminatorID = createSelector(
  all,
  responseDiscriminatorIDParamSelector,
  (responseDiscriminators, discriminatorID) => {
    return !discriminatorID
      ? []
      : sortCreatableCMSResources(
          responseDiscriminators.filter(
            (responseDiscriminator) => responseDiscriminator.discriminatorID === discriminatorID
          )
        );
  }
);
