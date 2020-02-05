import { constants, utils } from '@voiceflow/common';
import NLC from '@voiceflow/natural-language-commander';
import update from 'immutability-helper';
import _ from 'lodash';

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

import { resetTime, updateTest } from './actions';
import { TEST_STATUS } from './constants';
import { testSelector, testStateSelector, testStatusSelector } from './selectors';

const SLOT_TYPES = constants.slots;
const { DEFAULT_INTENTS } = constants.intents;
const { getSlotsForKeys, getUtterancesWithSlotNames } = utils.intent;

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
  const slots = slotAdapter.mapToDB(allSlotsSelector(state)).map(slotAdapter.spreadSynonyms);
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
      samples = getUtterancesWithSlotNames(intent.inputs, slots)
        .map((value) => value.trim())
        .filter(Boolean);
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
