import NLC from '@voiceflow/natural-language-commander';
import axios from 'axios';
import setError from 'ducks/modal';
import update from 'immutability-helper';
import { getSlotsForKeys, getUtterancesWithSlotNames } from 'intent_util';
import _ from 'lodash';

import { DEFAULT_INTENTS, SLOT_TYPES } from 'Constants';

export const UPDATE_TEST = 'test/UPDATE';
export const UPDATE_TEST_STATE = 'test/state/UPDATE';
export const UPDATE_TEST_TIME = 'test/time/UPDATE';

export const TEST_STATUS = {
  IDLE: 'IDLE',
  ACTIVE: 'ACTIVE',
  ENDED: 'ENDED',
};

const params = JSON.parse(localStorage.getItem('testParams')) || {};

const initialState = {
  nlc: null,
  id: null,
  status: TEST_STATUS.IDLE,
  time: 0,
  timer: null,
  state: {
    globals: [{}],
  },
  rendered: 0,
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
        time: action.payload,
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
  const { skill_id, global, platform } = skills.skill;

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

  const store = localStorage.getItem(`TEST_VARIABLES_${skill_id}`);
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

export const initializeTest = () => (dispatch, getState) => {
  const { skills } = getState();
  const { intents, slots, platform, locales } = skills.skill;

  const nlc = new NLC();

  // Load in built in slots and intents
  try {
    const language = locales[0].slice(0, 2);
    const builtInIntents = DEFAULT_INTENTS[language].defaults;

    builtInIntents.forEach((intent) => {
      const { samples, name } = intent;
      nlc.registerIntent({
        intent: name,
        utterances: samples,
        callback: _.noop,
      });
    });
  } catch (err) {
    console.error(err);
  }

  const builtInSlots = [];
  SLOT_TYPES.forEach((s) => {
    if (s.type.alexa) builtInSlots.push(s.type.alexa);
    if (s.type.google) builtInSlots.push(s.type.google);
  });

  builtInSlots.forEach((s) => {
    const matcher = /[\S\s]*/;
    nlc.addSlotType({
      type: s,
      matcher,
    });
  });

  slots.forEach((slot) => {
    if (slot.type.value && slot.type.value.toLowerCase() === 'custom') {
      nlc.addSlotType({
        type: slot.name,
        matcher: slot.inputs,
      });
    }
  });

  intents.forEach((intent) => {
    let samples;
    if (!intent.built_in) {
      samples = getUtterancesWithSlotNames(intent.inputs, slots);
    }

    const intentSlots = getSlotsForKeys(intent.inputs.map((input) => input.slots), slots, platform);
    nlc.registerIntent({
      slots: intentSlots,
      intent: intent.name,
      utterances: samples,
      callback: _.noop,
    });
  });

  dispatch(
    updateTest({
      nlc,
    })
  );
  dispatch(setupGlobals());
};

export const resetTime = () => ({
  type: UPDATE_TEST_TIME,
  payload: 0,
});

export const incrementTime = () => (dispatch, getState) => {
  dispatch({
    type: UPDATE_TEST_TIME,
    payload: getState().test.time + 1,
  });
};

export const renderTest = (diagramId) => async (dispatch, getState) => {
  if (diagramId === null) return;

  const { skills } = getState();
  const { intents, slots, platform } = skills.dev_skill || skills.skill;

  dispatch(updateTest({ rendered: 1 }));
  try {
    await axios.post(`/diagram/${diagramId}/test/publish`, {
      intents,
      slots,
      platform,
    });
    dispatch(initializeTest());
    dispatch(updateTest({ rendered: 2 }));
  } catch (err) {
    console.error(err);
    dispatch(setError('Could Not Render Your Test Project'));
  }
};

export const startTest = (diagramId, line = null) => (dispatch, getState) => {
  const { skills, test } = getState();
  const { repeat, platform, skill_id: skillId, diagram } = skills.skill;

  const currentGlobals = test.state.globals[0];
  localStorage.setItem(`TEST_VARIABLES_${skillId}`, JSON.stringify(currentGlobals));

  const state = {
    diagrams: [
      {
        id: diagramId || diagram,
      },
    ],
    input: '',
    line,
    testing: true,
    skill_id: 'TEST_SKILL',
    globals: [currentGlobals],
    repeat: repeat || 100,
    platform,
  };

  const timer = setInterval(() => {
    dispatch(incrementTime());
  }, 1000);

  dispatch(
    updateTest({
      status: TEST_STATUS.ACTIVE,
      timer,
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
      state: update(currentState, { globals: { 0: { [name]: { $set: value } } } }),
    })
  );
};

export const endTest = () => (dispatch, getState) => {
  const { timer } = getState().test;
  clearInterval(timer);
  dispatch(
    updateTest({
      status: TEST_STATUS.ENDED,
    })
  );
};

export const resetTest = () => (dispatch, getState) => {
  const { timer } = getState().test;
  clearInterval(timer);
  dispatch(resetTime());
  dispatch(setupGlobals());
  dispatch(
    updateTest({
      status: TEST_STATUS.IDLE,
    })
  );
};

export const leaveTest = () => (dispatch) => {
  dispatch(resetTest());
  dispatch(
    updateTest({
      rendered: 0,
    })
  );
};

export const fetchState = (input) => async (dispatch, getState) => {
  const { nlc, state } = getState().test;

  // const defaultIntents = DEFAULT_INTENTS[skill.locales[0].substring(0, 2)];
  // _.forEach(defaultIntents.defaults.concat(defaultIntents.built_ins), (dIntent) => {
  //   if (_.some(dIntent.samples, (s) => s.toLowerCase() === data.input.toLowerCase())) {
  //     data.detected_intents = [
  //       {
  //         intent: dIntent.name,
  //         slots: dIntent.slots,
  //       },
  //     ];
  //   }
  // });

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
      // NLC No Match'
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
