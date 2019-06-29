import update from 'immutability-helper';
import { SLOT_TYPES } from 'Constants';
import NLC from 'natural-language-commander';
import _ from 'lodash';
import { getUtterancesWithSlotNames, getSlotsForKeys } from 'intent_util';
import axios from 'axios';
import setError from 'ducks/modal';

export const UPDATE_TEST = 'test/UPDATE';
export const UPDATE_TEST_STATE = 'test/state/UPDATE';
export const UPDATE_TEST_TIME = 'test/time/UPDATE';
export const UPDATE_TEST_VARIABLE_MAPPING = 'test/variableMapping/UPDATE';

export const TEST_STATUS = {
  IDLE: 'IDLE',
  ACTIVE: 'ACTIVE',
  ENDED: 'ENDED',
};

const initialState = {
  nlc: null,
  id: null,
  slotMapping: {},
  variableMapping: {},
  status: TEST_STATUS.IDLE,
  time: 0,
  timer: null,
  state: {},
  rendered: false,
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
    case UPDATE_TEST_VARIABLE_MAPPING:
      return {
        ...state,
        variableMapping: {
          ...variableMapping,
          ...action.payload,
        },
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

export const initializeTest = () => (dispatch, getState) => {
  const { skills, variables } = getState();
  const { intents, slots, global, platform } = skills.skill;

  const variableMapping = variables.localVariables.concat(global).reduce((key, val) => {
    key[val] = 0;
    return key;
  }, {});

  const nlc = new NLC();
  const slotMapping = {};

  const built_in_slots = [];
  SLOT_TYPES.forEach((s) => {
    if (s.type.alexa) built_in_slots.push(s.type.alexa);
    if (s.type.google) built_in_slots.push(s.type.google);
  });

  built_in_slots.forEach((s) => {
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
    const slots = getSlotsForKeys(intent.inputs.map((input) => input.slots), slots, platform);

    nlc.registerIntent({
      slots,
      intent: intent.name,
      utterances: samples,
      callback: _.noop,
    });

    slotMapping[intent.name] = slots;
  });

  dispatch(
    updateTest({
      variableMapping,
      slotMapping,
      nlc,
    })
  );
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

export const updateVariableMapping = (variable, value) => ({
  type: UPDATE_TEST_VARIABLE_MAPPING,
  payload: {
    [variable]: value,
  },
});

export const renderTest = (diagramId) => async (dispatch, getState) => {
  if (diagramId === null) return;

  const { skills } = getState();
  const { intents, slots, platform } = skills.dev_skill || skills.skill;

  try {
    await axios.post(`/diagram/${diagramId}/test/publish`, {
      intents,
      slots,
      platform,
    });

    dispatch(updateTest({ rendered: true }));
    dispatch(initializeTest());
  } catch (err) {
    console.log(err);
    dispatch(setError('Could Not Render Your Test Project'));
  }
};

export const startTest = (diagramId, line = null) => (dispatch, getState) => {
  const { skills } = getState();
  const { repeat, platform } = skills.skill;

  const state = {
    diagrams: [
      {
        id: diagramId,
      },
    ],
    input: '',
    line,
    testing: true,
    skill_id: 'TEST_SKILL',
    globals: [
      {
        sessions: 1,
        user_id: 'TEST_USER',
        platform,
      },
    ],
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

export const leaveTest = () =>
  updateTest({
    rendered: false,
  });

export const updateState = (newState) =>
  updateTest({
    state: newState,
  });

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
  dispatch(
    updateTest({
      status: TEST_STATUS.IDLE,
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

  // if (nlc) {
  //   try {
  //     const results = await nlc.handleCommand(data.input);
  //     const { diagram_intents, detected_intents } = getDiagramIntents(diagramEngine, results, testing_info);
  //     data.diagram_intents = diagram_intents;
  //     data.detected_intents = detected_intents;
  //   } catch (err) {
  //     // NLC No Match'
  //     console.error('NLC No Match');
  //   }
  // }

  state.intent = input;

  try {
    const { data: newState } = await axios.post('/test/interact', state);
    if (newState.ended) dispatch(endTest);
    return newState;
  } catch (err) {
    console.error(err);
    return null;
  }
};
