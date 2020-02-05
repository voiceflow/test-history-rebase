import client from '@/client';

import { UPDATE_DIALOG, UPDATE_TEST, UPDATE_TEST_MODE, UPDATE_TEST_STATE, UPDATE_TEST_TIME } from './actions';
import { TEST_STATUS } from './constants';
import manageDialog from './dialog';
import manageInput from './input';
import { testSelector } from './selectors';
import { updateState } from './sideEffects';

export * from './actions';
export * from './constants';
export * from './selectors';
export * from './sideEffects';

const initialState = {
  nlc: null,
  id: null,
  status: TEST_STATUS.IDLE,
  startTime: 0,
  state: {
    display_info: null,
    globals: [{}],
    slots: {},
  },
  configId: null,
  configObject: null,
  userTest: false,
  inTestMode: false,
  dialog: {
    status: null,
  },
};

// reducers

function testReducer(state = initialState, action) {
  switch (action.type) {
    case UPDATE_TEST_STATE:
      return {
        ...state,
        state: {
          ...state.state,
          ...action.payload,
        },
      };
    case UPDATE_TEST:
      return {
        ...state,
        ...action.payload,
      };
    case UPDATE_TEST_TIME:
      return {
        ...state,
        startTime: action.payload,
      };
    case UPDATE_TEST_MODE:
      return {
        ...state,
        inTestMode: !state.inTestMode,
      };
    case UPDATE_DIALOG:
      return {
        ...state,
        dialog: {
          ...state.dialog,
          ...action.payload,
        },
      };
    default:
      return state;
  }
}

export default testReducer;

// side effects

export const fetchState = (input) => async (dispatch, getState) => {
  await dispatch(manageInput(input));
  await dispatch(manageDialog(input));

  const { state, dialog } = testSelector(getState());
  if (dialog.status) {
    return state;
  }

  try {
    const newState = await client.testing.interact(state);
    dispatch(updateState(newState));
    return newState;
  } catch (err) {
    console.error(err);
    return null;
  }
};
