import type { Nullish } from '@voiceflow/common';
import type { Channel, FolderScope, Language } from '@voiceflow/dtos';
import type { Normalized } from 'normal-store';
import { denormalize, getMany, getOne, hasMany, hasOne } from 'normal-store';
import type { Selector } from 'reselect';
import { createSelector } from 'reselect';

import { idParamSelector, idsParamSelector } from '@/ducks/utils/crudV2';
import { createSubSelector } from '@/ducks/utils/selector';

import type { DesignerState } from '../designer.state';
import { designerRootSelector } from '../selectors/designer.select';

export const channelParamSelector = (_: any, { channel }: { channel: Nullish<Channel> }) => channel;

export const languageParamSelector = (_: any, { language }: { language: Nullish<Language> }) => language;

export const folderIDParamSelector = (_: any, { folderID }: { folderID: string | null }) => folderID;

export const folderIDsParamSelector = (_: any, { folderIDs }: { folderIDs: string[] }) => folderIDs;

export const parentIDParamSelector = (_: any, { parentID }: { parentID: string | null }) => parentID;

export const intentIDParamSelector = (_: any, { intentID }: { intentID: string | null }) => intentID;

export const intentIDsParamSelector = (_: any, { intentIDs }: { intentIDs: string[] }) => intentIDs;

export const entityIDParamSelector = (_: any, { entityID }: { entityID: string | null }) => entityID;

export const threadIDParamSelector = (_: any, { threadID }: { threadID: string | null }) => threadID;

export const functionIDParamSelector = (_: any, { functionID }: { functionID: string | null }) => functionID;

export const diagramIDParamSelector = (_: any, { diagramID }: { diagramID: string | null }) => diagramID;

export const responseIDParamSelector = (_: any, { responseID }: { responseID: Nullish<string> }) => responseID;

export const responseDiscriminatorIDParamSelector = (
  _: any,
  { responseDiscriminatorID }: { responseDiscriminatorID: Nullish<string> }
) => responseDiscriminatorID;

export const folderScopeParamSelector = (_: any, { folderScope }: { folderScope: FolderScope }) => folderScope;

export const createDesignerCRUDSelectors = <Type>(root: Selector<any, Normalized<Type>>) => ({
  all: createSelector([root], denormalize),

  map: createSelector([root], (state) => ({ ...state.byKey })),

  keys: createSelector([root], (state) => state.allKeys),

  count: createSelector([root], (state) => state.allKeys.length),

  isEmpty: createSelector([root], (state) => !state.allKeys.length),

  oneByID: createSelector([root, idParamSelector], (state, id) => (id ? getOne(state, id) : null)),

  allByIDs: createSelector([root, idsParamSelector], (state, ids) => getMany(state, ids)),

  hasOneByID: createSelector([root, idParamSelector], (state, id) => !!id && hasOne(state, id)),

  getOneByID: createSelector(
    [root],
    (state) =>
      ({ id }: { id: Nullish<string> }) =>
        id ? getOne(state, id) : null
  ),

  hasAllByIDs: createSelector([root, idsParamSelector], (state, ids) => hasMany(state, ids)),

  getAllByIDs: createSelector(
    [root],
    (state) =>
      ({ ids }: { ids: string[] }) =>
        getMany(state, ids)
  ),
});

export const createByFolderIDSelectors = <Type extends { folderID: string | null }>(all: Selector<any, Type[]>) => {
  const allByFolderID = createSelector([all, folderIDParamSelector], (resources, folderID) =>
    resources.filter((resource) => resource.folderID === folderID)
  );

  const allByFolderIDs = createSelector([all, folderIDsParamSelector], (resources, folderIDs) =>
    resources.filter((resource) => !!resource.folderID && folderIDs.includes(resource.folderID))
  );

  return {
    allByFolderID,
    allByFolderIDs,
    countByFolderID: createSelector([allByFolderID], (resources) => resources.length),
  };
};

export const createDesignerSelector = <K extends keyof DesignerState>(key: K) =>
  createSubSelector(designerRootSelector, key);
