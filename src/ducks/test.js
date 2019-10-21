import { constants, utils } from '@voiceflow/common';
import NLC from '@voiceflow/natural-language-commander';
import update from 'immutability-helper';
import _ from 'lodash';
import { createSelector } from 'reselect';

import client from '@/client';
import intentAdapter from '@/client/adapters/intent';
import slotAdapter from '@/client/adapters/slot';
import { allIntentsSelector } from '@/ducks/intent';
import { setError } from '@/ducks/modal';
import {
  activeDiagramIDSelector,
  activeLocalesSelector,
  activePlatformSelector,
  activeProjectIDSelector,
  activeSkillIDSelector,
  activeSkillMetaSelector,
  globalVariablesSelector,
} from '@/ducks/skill';
import { allSlotsSelector } from '@/ducks/slot';

import { createRootSelector } from './utils';

const { DEFAULT_INTENTS } = constants.intents;
const SLOT_TYPES = constants.slots;
const { getSlotsForKeys, getUtterancesWithSlotNames } = utils.intent;

export const STATE_KEY = 'test';

// actions

export const UPDATE_TEST = 'TEST:UPDATE';
export const UPDATE_TEST_STATE = 'TEST:STATE:UPDATE';
export const UPDATE_TEST_TIME = 'TEST:TIME:UPDATE';
export const UPDATE_TEST_MODE = 'TEST:UPDATE_TEST_MODE';

export const TEST_STATUS = {
  IDLE: 'IDLE',
  ACTIVE: 'ACTIVE',
  ENDED: 'ENDED',
};

const initialState = {
  nlc: null,
  id: null,
  status: TEST_STATUS.IDLE,
  startTime: 0,
  state: {
    display_info: null,
    globals: [{}],
  },
  configId: null,
  configObject: null,
  userTest: false,
  inTestMode: false,
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
    default:
      return state;
  }
}

export default testReducer;

// selectors

export const testSelector = createRootSelector(STATE_KEY);

export const testStatusSelector = createSelector(
  testSelector,
  ({ status }) => status
);

export const testStateSelector = createSelector(
  testSelector,
  ({ state }) => state
);

export const userTestSelector = createSelector(
  testSelector,
  ({ userTest }) => userTest
);

export const testTimeSelector = createSelector(
  testSelector,
  ({ startTime }) => startTime
);

export const testDisplaySelector = createSelector(
  testSelector,
  ({ state: { display_info } }) => display_info
);

export const testGlobalsSelector = createSelector(
  testSelector,
  ({ state: { globals } }) => globals[0]
);

// action creators

export const updateTest = (payload) => ({
  type: UPDATE_TEST,
  payload,
});

export const updateInTest = () => ({
  type: UPDATE_TEST_MODE,
});

export const resetState = () => (dispatch, getState) => {
  const state = getState();
  const projectID = activeProjectIDSelector(state);
  const globalVariables = globalVariablesSelector(state);
  const platform = activePlatformSelector(state);

  const testState = testStateSelector(state);

  let currentGlobals = {};
  if (globalVariables)
    globalVariables.forEach((name) => {
      currentGlobals[name] = 0;
    });

  currentGlobals = {
    ...currentGlobals,
    sessions: 1,
    user_id: 'TEST_USER',
    platform,
  };

  const store = localStorage.getItem(`TEST_VARIABLES_${projectID}`);
  if (store) {
    try {
      const savedGlobals = JSON.parse(store);
      Object.keys(savedGlobals).forEach((name) => {
        if (name in currentGlobals) currentGlobals[name] = savedGlobals[name];
      });
    } catch (err) {
      console.error(err);
    }
  }

  dispatch(
    updateTest({
      state: {
        ...testState,
        display_info: null,
        globals: [currentGlobals],
      },
    })
  );
};

export const initializeTest = (options = {}) => (dispatch, getState) => {
  const state = getState();
  const intents = intentAdapter.mapToDB(allIntentsSelector(state));
  const slots = slotAdapter.mapToDB(allSlotsSelector(state));
  const platform = activePlatformSelector(state);
  const locales = activeLocalesSelector(state);

  const nlc = new NLC();

  slots.forEach((slot) => {
    if (slot.type?.value === 'Custom') {
      try {
        nlc.addSlotType({
          type: slot.name,
          matcher: slot.inputs,
        });
      } catch (err) {
        console.error('NLC Unable To Register Custom Slot:', slot, err);
      }
    }
  });

  const builtInSlots = [];
  SLOT_TYPES.forEach((s) => {
    if (s.type.alexa) builtInSlots.push(s.type.alexa);
    if (s.type.google) builtInSlots.push(s.type.google);
  });

  builtInSlots.forEach((slot) => {
    const matcher = /[\S\s]*/;
    try {
      nlc.addSlotType({
        type: slot,
        matcher,
      });
    } catch (err) {
      console.error('NLC Unable To Register Built in Slot:', slot, err);
    }
  });

  intents.forEach((intent) => {
    let samples;
    if (!intent.built_in) {
      samples = getUtterancesWithSlotNames(intent.inputs, slots);
    }

    const intentSlots = getSlotsForKeys(intent.inputs.map((input) => input.slots), slots, platform);
    try {
      nlc.registerIntent({
        slots: intentSlots,
        intent: intent.name,
        utterances: samples,
        callback: _.noop,
      });
    } catch (err) {
      console.error('NLC Unable To Register Custom Intent:', intent, err);
    }
  });

  // Load in built in slots and intents
  try {
    const language = locales[0].slice(0, 2);
    const builtInIntents = DEFAULT_INTENTS[language].defaults;

    builtInIntents.forEach((intent) => {
      const { samples, name } = intent;
      try {
        nlc.registerIntent({
          intent: name,
          utterances: samples,
          callback: _.noop,
        });
      } catch (err) {
        console.error('NLC Unable To Register Built In Intent:', intent, err);
      }
    });

    const AUDIO_INTENTS = [
      {
        name: 'Pause',
        intent: 'AMAZON.PauseIntent',
      },
      {
        name: 'Resume',
        intent: 'AMAZON.ResumeIntent',
      },
      {
        name: 'Next',
        intent: 'AMAZON.NextIntent',
      },
      {
        name: 'Previous',
        intent: 'AMAZON.PreviousIntent',
      },
    ];

    AUDIO_INTENTS.forEach(({ intent, name }) => {
      try {
        nlc.registerIntent({
          intent,
          utterances: [name],
          callback: _.noop,
        });
      } catch (err) {
        console.error('NLC Unable To Register Audio Intent:', intent, err);
      }
    });
  } catch (err) {
    console.error(err);
  }

  dispatch(
    updateTest({
      nlc,
    })
  );
  dispatch(resetState());

  if (options.userTest) {
    dispatch(
      updateTest({
        userTest: true,
      })
    );
  }
};

export const resetTime = () => ({
  type: UPDATE_TEST_TIME,
  payload: 0,
});

export const renderTest = () => async (dispatch, getState) => {
  const state = getState();
  const intents = allIntentsSelector(state);
  const slots = allSlotsSelector(state);
  const platform = activePlatformSelector(state);
  const diagramID = activeDiagramIDSelector(state);

  const testState = testStateSelector(state);

  if (diagramID === null) return;

  try {
    await client.testing.render(diagramID, {
      fulfillment:
        '"{"AMAZON.StartOverIntent":{"slot_config":{}},"AMAZON.FallbackIntent":{"slot_config":{}},"AMAZON.RepeatIntent":{"slot_config":{}},"AMAZON.HelpIntent":{"slot_config":{}}}"',
      intents: intentAdapter.mapToDB(intents),
      slots: slotAdapter.mapToDB(slots),
      platform,
    });
    if (!testState.stackSize || testState.stackSize === 1) dispatch(initializeTest());
  } catch (err) {
    console.error(err);
    dispatch(setError('Could Not Render Your Test Project'));
  }
};

export const startTest = (diagramID, line = null) => (dispatch, getState) => {
  const state = getState();

  const testState = testStateSelector(state);
  const platform = activePlatformSelector(state);
  const projectID = activeProjectIDSelector(state);
  const activeDiagramID = activeDiagramIDSelector(state);
  const locales = activeLocalesSelector(state);
  const { repeat } = activeSkillMetaSelector(state);

  const currentGlobals = testState.globals[0];
  localStorage.setItem(`TEST_VARIABLES_${projectID}`, JSON.stringify(currentGlobals));

  const newTestState = {
    diagrams: [
      {
        id: diagramID || activeDiagramID,
      },
    ],
    display_info: null,
    input: '',
    line,
    testing: true,
    locale: locales && locales[0],
    skill_id: 'TEST_SKILL',
    globals: [currentGlobals],
    repeat: repeat || 100,
    platform,
  };

  dispatch(
    updateTest({
      status: TEST_STATUS.ACTIVE,
      startTime: Date.now() / 1000,
      state: newTestState,
    })
  );
};

export const updateState = (newState) =>
  updateTest({
    state: newState,
  });

export const updateGlobal = (name, value) => (dispatch, getState) => {
  const currentState = testStateSelector(getState());

  dispatch(
    updateTest({
      state: update(currentState, {
        globals: {
          0: {
            [name]: {
              $set: value,
            },
          },
        },
      }),
    })
  );
};

export const shareTest = () => async (dispatch, getState) => {
  try {
    const state = getState();
    const projectID = activeDiagramIDSelector(state);
    const skillID = activeSkillIDSelector(state);
    const diagramID = activeDiagramIDSelector(state);

    const testState = testStateSelector(state);
    const testStatus = testStatusSelector(state);
    const { configId, configObject } = testSelector(state);

    let globals;
    const store = localStorage.getItem(`TEST_VARIABLES_${projectID}`);
    if (testStatus !== TEST_STATUS.IDLE && store) {
      globals = JSON.parse(store);
    } else {
      globals = testState.globals[0];
    }

    const currentConfigObject = projectID + JSON.stringify(globals);

    // if nothing has changed, just send back the original config
    if (currentConfigObject === configObject && configId) return configId;

    const newConfigId = await client.testing.createInfo(skillID, diagramID, globals);

    dispatch(
      updateTest({
        configId: newConfigId,
        configObject: currentConfigObject,
      })
    );
    return newConfigId;
  } catch (err) {
    console.error(err);
    dispatch(setError('Unable to generate share link'));
    return 'INVALID';
  }
};

export const endTest = () => (dispatch) => {
  dispatch(
    updateTest({
      status: TEST_STATUS.ENDED,
    })
  );
};

export const resetTest = () => (dispatch, getState) => {
  dispatch(resetTime());
  const testStatus = testStatusSelector(getState());
  if (testStatus !== TEST_STATUS.IDLE) dispatch(resetState());
  dispatch(
    updateTest({
      status: TEST_STATUS.IDLE,
    })
  );
};

export const fetchState = (input) => async (dispatch, getState) => {
  const { nlc, state } = testSelector(getState());

  delete state.intent;
  delete state.slots;
  delete state.input;

  if (input && nlc) {
    state.input = input;
    try {
      const result = await nlc.handleCommand(input);

      const { intent, slots } = result;

      if (slots) {
        const formattedSlots = {};
        slots.forEach((slot) => {
          const { name, value } = slot;
          formattedSlots[name] = {
            name,
            value,
          };
        });
        state.slots = formattedSlots;
      }

      state.intent = intent;
    } catch (err) {
      console.error('NLC No Match', err);
    }
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
