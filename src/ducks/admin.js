import axios from 'axios';

export const FIND_CREATOR = 'FIND_CREATOR';

const initialState = {
  // The current creator being searched
  current_creator: {},
  boards: [],
};

export default function adminReducer(state = initialState, action) {
  switch (action.type) {
    case FIND_CREATOR:
      return {
        ...state,
        current_creator: action.payload.creator,
        boards: action.payload.boards
      }
    default:
      return state;
  }
}

export const findCreator = (creatorInfo) => {
  
}
