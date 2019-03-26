import update from 'immutability-helper'

// you can use normalize, deleteNormalize, addNormalize, updateNormalize individually
export const normalize = (id_type, list) => {
  const byId = {}
  const allIds = []
  for(var item of list){
    byId[item[id_type]] = item
    allIds.push(item[id_type])
  }

  return { byId, allIds }
}

// structure must be an object that contains byId (object) and allIds (array)
export const deleteNormalize = (id, structure) => {
  let byId = structure.byId
  let allIds = structure.allIds
  let index = allIds.indexOf(id)

  if(index !== -1){
    byId = update(byId, {$unset: [id]})
    allIds = update(allIds, {$splice: [[index, 1]]})
  }
  return { byId, allIds}
}

export const addNormalize = (id_type, data, structure) => {
  let byId = structure.byId
  let allIds = structure.allIds

  if(data[id_type]){
    byId = update(byId, {[id_type]: {$set: data}})
    allIds = update(allIds, {$push: [data[id_type]]})
  }

  return {byId, allIds}
}

export const updateNormalize = (id, data, structure) => {
  return { byId: update(structure.byId, {
    [id]: {
      $merge: data
    }
  }), allIds: structure.allIds }
}

export const unnormalize = (structure) => {
  return structure.allIds.map(i => structure.byId[i])
}

export default (id_type, reducer, action) => {
  return (fn, params) => {
    if(typeof fn === 'string'){
      switch(fn){
        case 'create':
          fn = normalize
          break
        case 'add':
          fn = addNormalize
          break
        case 'delete':
          fn = deleteNormalize
          break
        case 'update':
          fn = updateNormalize
          break
        default:
          return
      }
    }
    return (dispatch, getState) => {
      var state
      switch(fn.name){
        case 'normalize':
          state = fn(id_type, params.data)
          break
        case 'deleteNormalize':
          state = fn(params.id, getState()[reducer])
          break
        case 'addNormalize':
          state = fn(id_type, params.data, getState()[reducer])
          break
        case 'updateNormalize':
          state = fn(params.id, params.data, getState()[reducer])
          break
        default:
          return        
      }
      if(state.byId && Array.isArray(state.allIds)){
        dispatch(action(state))
      }
    }
  }
}