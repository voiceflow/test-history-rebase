import { createSelector } from 'reselect';

import { stringify } from '@/utils/functional';
import {
  addAllNormalizedByKeys,
  addNormalizedByKey,
  denormalize,
  getNormalizedByKey,
  normalize,
  removeNormalizedByKey,
  reorderKeys,
  updateNormalizedByKey,
} from '@/utils/normalized';

import { createAction, createRootSelector } from '.';

export const DEFAULT_STATE = {
  allKeys: [],
  byKey: {},
};

// actions

export const CRUD_ADD = 'CRUD:ADD';
export const CRUD_ADD_MANY = 'CRUD:ADD_MANY';
export const CRUD_UPDATE = 'CRUD:UPDATE';
export const CRUD_REMOVE = 'CRUD:REMOVE';
export const CRUD_REPLACE = 'CRUD:REPLACE';
export const CRUD_REORDER = 'CRUD:REORDER';

// reducers

export const crudReorderReducer = (state, { payload }) => {
  const { byKey } = state;
  return reorderKeys(payload, byKey);
};

export const crudAddReducer = (state, { payload: { key, value } }) => addNormalizedByKey(state, key, value);

export const crudAddManyReducer = (state, { payload: values }, getKey) => addAllNormalizedByKeys(state, values, getKey);

export const crudUpdateReducer = (state, { payload: { key, value, patch } }) => {
  const newValue = patch ? { ...getNormalizedByKey(state, key), ...value } : value;

  return updateNormalizedByKey(state, key, newValue);
};

export const crudRemoveReducer = (state, { payload: key }) => removeNormalizedByKey(state, key);

export const crudReplaceReducer = ({ payload: values }, getKey) => normalize(values, getKey);

const createCRUDReducer = (modelType, getKey = (obj) => stringify(obj.id)) => (state = DEFAULT_STATE, action) => {
  if (!action.meta || action.meta.modelType !== modelType) {
    return state;
  }

  switch (action.type) {
    case CRUD_ADD:
      return crudAddReducer(state, action);
    case CRUD_ADD_MANY:
      return crudAddManyReducer(state, action, getKey);
    case CRUD_UPDATE:
      return crudUpdateReducer(state, action);
    case CRUD_REMOVE:
      return crudRemoveReducer(state, action);
    case CRUD_REPLACE:
      return crudReplaceReducer(action, getKey);
    case CRUD_REORDER:
      return crudReorderReducer(state, action);
    default:
      return state;
  }
};

export default createCRUDReducer;

// selectors

export const createCRUDSelectors = (modelType) => {
  const root = createRootSelector(modelType);
  const all = createSelector(
    root,
    denormalize
  );
  const collect = createSelector(
    root,
    (models) => (collector) => collector(models)
  );
  const map = createSelector(
    root,
    ({ byKey }) => byKey
  );
  const key = createSelector(
    root,
    ({ allKeys }) => allKeys
  );

  return {
    root,
    all,
    map,
    key,
    findByIDs: createSelector(
      collect,
      (findModels) => (ids) =>
        findModels(({ allKeys, byKey }) =>
          ids.reduce((acc, id) => {
            if (allKeys.includes(id)) {
              acc.push(byKey[id]);
            }

            return acc;
          }, [])
        )
    ),
    byID: createSelector(
      root,
      (normalized) => (id) => getNormalizedByKey(normalized, id)
    ),
    has: createSelector(
      root,
      ({ allKeys }) => allKeys.length !== 0
    ),
  };
};

// action creators

export const crudAction = (modelType, type, payload, meta) => createAction(type, payload, { modelType, ...meta });

export const addModel = (modelType) => (key, value) => crudAction(modelType, CRUD_ADD, { key, value });

export const addManyModels = (modelType) => (values) => crudAction(modelType, CRUD_ADD_MANY, values);

export const updateModel = (modelType) => (key, value, patch = false) => crudAction(modelType, CRUD_UPDATE, { key, value, patch });

export const removeModel = (modelType) => (key) => crudAction(modelType, CRUD_REMOVE, key);

export const replaceModels = (modelType) => (values, meta) => crudAction(modelType, CRUD_REPLACE, values, meta);

export const reorderModels = (modelType) => (keyArray) => crudAction(modelType, CRUD_REORDER, keyArray);

export const createCRUDActionCreators = (modelType) => ({
  add: addModel(modelType),
  addMany: addManyModels(modelType),
  update: updateModel(modelType),
  remove: removeModel(modelType),
  replace: replaceModels(modelType),
  reorder: reorderModels(modelType),
});
