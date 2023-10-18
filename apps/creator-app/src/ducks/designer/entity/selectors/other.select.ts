import { createSelector } from 'reselect';

import { idsParamSelector } from '@/ducks/utils/crudV2';

import { createByFolderIDSelectors } from '../../utils';
import { getAllByEntityID as getAllVariantsByEntityID } from '../entity-variant/entity-variant.select';
import { all, allByIDs, oneByID } from './crud.select';

export const { allByFolderID, countByFolderID } = createByFolderIDSelectors(all);

export const mapByName = createSelector(all, (entities) => Object.fromEntries(entities.map((entity) => [entity.name, entity])));

export const allWithoutIDs = createSelector(all, idsParamSelector, (entities, ids) => entities.filter((entity) => !ids.includes(entity.id)));

export const allWithVariants = createSelector(all, getAllVariantsByEntityID, (entities, getVariants) =>
  entities.map((entity) => ({ ...entity, variants: getVariants({ entityID: entity.id }) }))
);

export const allOrderedByName = createSelector([all], (entities) => entities.sort((a, b) => a.name.localeCompare(b.name)));

export const oneWithVariantByID = createSelector(oneByID, getAllVariantsByEntityID, (entity, getVariants) =>
  entity ? { ...entity, variants: getVariants({ entityID: entity.id }) } : null
);

export const allWithVariantsByIDs = createSelector(allByIDs, getAllVariantsByEntityID, (entities, getVariants) =>
  entities.map((entity) => ({ ...entity, variants: getVariants({ entityID: entity.id }) }))
);
