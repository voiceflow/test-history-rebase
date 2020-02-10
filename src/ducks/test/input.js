import { utils } from '@voiceflow/common';
import _ from 'lodash';

import { updateDialog } from './actions';
import { testSelector } from './selectors';
import { updateState } from './sideEffects';

const { formatName } = utils.intent;

const fallbackIntent = 'AMAZON.FallbackIntent';

const manageInput = (input) => async (dispatch, getState) => {
  const reduxState = getState();
  const { dialog: _dialog, state: _state, nlc } = testSelector(reduxState);

  // mutate state and dialog and save at the end
  const state = { ..._state };
  const dialog = { ..._dialog };

  if (!dialog.status) {
    delete state.intent;
    delete state.input;
    state.slots = {};
  }

  if (input && nlc) {
    state.input = input;

    const result = (await nlc.handleCommand(input).catch(_.noop)) || nlc.intents.find(({ intent }) => intent === input);
    if (result) {
      const { intent, slots } = result;

      if (slots) {
        const formattedSlots = slots.reduce((acc, slot) => {
          const { name, value } = slot;
          const formattedName = formatName(name);
          if (value) {
            acc[formattedName] = {
              name: formattedName,
              value,
            };
          }
          return acc;
        }, {});

        state.slots = formattedSlots;
      }

      state.intent = intent;
      dialog.status = null;
      dialog.slot = null;
    }

    // no intent matched
    if (!state.intent) {
      state.intent = fallbackIntent;
    }
  }

  dispatch(updateDialog(dialog));
  dispatch(updateState(state));
};

export default manageInput;
