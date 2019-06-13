import update from 'immutability-helper';

// you can use normalize, deleteNormalize, addNormalize, updateNormalize individually
export const normalize = (id_type, list) => {
  const byId = {};
  const allIds = [];

  // eslint-disable-next-line no-restricted-syntax
  for (const item of list) {
    byId[item[id_type]] = item;
    allIds.push(item[id_type]);
  }

  return { byId, allIds };
};

// structure must be an object that contains byId (object) and allIds (array)
export const deleteNormalize = (id, structure) => {
  let byId = structure.byId;
  let allIds = structure.allIds;
  const index = allIds.indexOf(id);

  if (index !== -1) {
    byId = update(byId, { $unset: [id] });
    allIds = update(allIds, { $splice: [[index, 1]] });
  }
  return { byId, allIds };
};

export const addNormalize = (id_type, data, structure) => {
  let byId = structure.byId;
  let allIds = structure.allIds;

  if (data[id_type]) {
    byId = update(byId, { [data[id_type]]: { $set: data } });
    allIds = update(allIds, { $push: [data[id_type]] });
  }

  return { byId, allIds };
};

export const updateNormalize = (id, data, structure) => {
  return {
    byId: update(structure.byId, {
      [id]: {
        $merge: data,
      },
    }),
    allIds: structure.allIds,
  };
};

export const unnormalize = (structure) => {
  return structure.allIds.map((i) => structure.byId[i]);
};

const validState = (state) => state.byId && Array.isArray(state.allIds);
export default class Normalize {
  constructor(id_type, reducer, action) {
    this.id_type = id_type;
    this.reducer = reducer;
    this.action = action;
  }

  create(params) {
    return (dispatch) => {
      const state = normalize(this.id_type, params.data);
      if (validState(state)) dispatch(this.action(state));
    };
  }

  add(params) {
    return (dispatch, getState) => {
      const state = addNormalize(this.id_type, params.data, getState()[this.reducer]);
      if (validState(state)) dispatch(this.action(state));
    };
  }

  delete(params) {
    return (dispatch, getState) => {
      const state = deleteNormalize(params.id, getState()[this.reducer]);
      if (validState(state)) dispatch(this.action(state));
    };
  }

  update(params) {
    return (dispatch, getState) => {
      const state = updateNormalize(params.id, params.data, getState()[this.reducer]);
      if (validState(state)) dispatch(this.action(state));
    };
  }
}
