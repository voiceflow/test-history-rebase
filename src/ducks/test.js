import { constants, utils } from '@voiceflow/common';
import NLC from '@voiceflow/natural-language-commander';
import axios from 'axios';
import update from 'immutability-helper';
import _ from 'lodash';

import { setError } from '@/ducks/modal';

const { DEFAULT_INTENTS } = constants.intents;
const SLOT_TYPES = constants.slots;
const { getSlotsForKeys, getUtterancesWithSlotNames } = utils.intent;

export const UPDATE_TEST = 'test/UPDATE';
export const UPDATE_TEST_STATE = 'test/state/UPDATE';
export const UPDATE_TEST_TIME = 'test/time/UPDATE';

export const TEST_STATUS = {
  IDLE: 'IDLE',
  ACTIVE: 'ACTIVE',
  ENDED: 'ENDED',
};

// load in previous test setting
const params = JSON.parse(localStorage.getItem('testParams')) || {
  debug: true,
};

const initialState = {
  nlc: null,
  id: null,
  status: TEST_STATUS.IDLE,
  startTime: 0,
  state: {
    globals: [{}],
  },
  configId: null,
  configObject: null,
  userTest: false,
  debug: !!params.debug,
};

export default function testReducer(state = initialState, action) {
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
    default:
      return state;
  }
}

export const updateTest = (payload) => ({
  type: UPDATE_TEST,
  payload,
});

export const setDebug = (value) =>
  updateTest({
    debug: !!value,
  });

export const setupGlobals = () => (dispatch, getState) => {
  const { skills, test } = getState();
  const { project_id: projectId, global, platform } = skills.skill;

  let currentGlobals = {};
  if (global)
    global.forEach((name) => {
      currentGlobals[name] = 0;
    });

  currentGlobals = {
    ...currentGlobals,
    sessions: 1,
    user_id: 'TEST_USER',
    platform,
  };

  const store = localStorage.getItem(`TEST_VARIABLES_${projectId}`);
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
        ...test.state,
        globals: [currentGlobals],
      },
    })
  );
};

export const initializeTest = (options = {}) => (dispatch, getState) => {
  const { skills } = getState();
  const { intents, slots, platform, locales } = skills.skill;

  const nlc = new NLC();

  slots.forEach((slot) => {
    if (_.get(slot, ['type', 'value']) === 'Custom') {
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
  dispatch(setupGlobals());

  if (options.userTest) {
    dispatch(
      updateTest({
        debug: false,
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
  const { skills } = getState();
  const { intents, slots, platform, diagram: diagramId } = skills.dev_skill || skills.skill;
  if (diagramId === null) return;

  try {
    await axios.post(`/diagram/${diagramId}/test/publish`, {
      intents,
      slots,
      platform,
    });
    dispatch(initializeTest());
  } catch (err) {
    console.error(err);
    dispatch(setError('Could Not Render Your Test Project'));
  }
};

export const startTest = (diagramId, line = null) => (dispatch, getState) => {
  const { skills, test } = getState();
  const { repeat, platform, diagram, project_id: projectId, locales } = skills.skill;

  const currentGlobals = test.state.globals[0];
  localStorage.setItem(`TEST_VARIABLES_${projectId}`, JSON.stringify(currentGlobals));

  const state = {
    diagrams: [
      {
        id: diagramId || diagram,
      },
    ],
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
      state,
    })
  );
};

export const updateState = (newState) =>
  updateTest({
    state: newState,
  });

export const updateGlobal = (name, value) => (dispatch, getState) => {
  const currentState = getState().test.state;
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
    const { skills, test } = getState();
    const { project_id: projectId, diagram, skill_id: skillId } = skills.skill;
    const { configId, configObject, state, status } = test;

    let globals;
    const store = localStorage.getItem(`TEST_VARIABLES_${projectId}`);
    if (status !== TEST_STATUS.IDLE && store) {
      globals = JSON.parse(store);
    } else {
      globals = state.globals[0];
    }

    const currentConfigObject = projectId + JSON.stringify(globals);

    // if nothing has changed, just send back the original config
    if (currentConfigObject === configObject && configId) return configId;

    const { data: newConfigId } = await axios.post(`/test/makeInfo/${skillId}`, {
      diagram,
      globals,
    });

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

export const resetTest = () => (dispatch) => {
  dispatch(resetTime());
  dispatch(setupGlobals());
  dispatch(
    updateTest({
      status: TEST_STATUS.IDLE,
    })
  );
};

export const fetchState = (input) => async (dispatch, getState) => {
  const { nlc, state } = getState().test;

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
      console.error('NLC No Match');
    }
  }

  try {
    const { data: newState } = await axios.post('/test/interact', state);
    return newState;
  } catch (err) {
    console.error(err);
    return null;
  }
};
