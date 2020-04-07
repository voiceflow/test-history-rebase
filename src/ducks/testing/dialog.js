import { utils } from '@voiceflow/common';
import _ from 'lodash';

import client from '@/client';
import slotAdapter, { spreadSynonyms } from '@/client/adapters/slot';
import { allIntentsSelector } from '@/ducks/intent';
import { allSlotsSelector } from '@/ducks/slot';

import { updateDialog } from './actions';
import { testSelector } from './selectors';
import { updateState } from './sideEffects';

const { getUtterancesWithSlotNames } = utils.intent;

const DialogStatus = {
  PROMPT: 'prompt',
  CONFIRM: 'confirm',
};

const speakTrace = async (utterances, slots, lineID) => {
  const texts = getUtterancesWithSlotNames(utterances, slots, false, true);
  const text = _.sample(texts);
  const audio = await client.testing.getSpeakAudio({ ssml: text, voice: '_DEFAULT' });

  return {
    block: 'Speak',
    line: {
      id: lineID,
    },
    audio: [audio],
    output: `<speak><voice name="_DEFAULT">${text}</voice></speak>`,
  };
};

const manageDialog = (input) => async (dispatch, getState) => {
  const reduxState = getState();
  const { dialog: _dialog, state: _state } = testSelector(reduxState);

  // mutate state and dialog and save at the end
  const state = { ..._state };
  const dialog = { ..._dialog };

  // use current intents and slots in the project
  const intents = allIntentsSelector(reduxState);
  const slots = allSlotsSelector(reduxState);

  // if an intent is matched, attempt to perform dialog management on it
  const intent = state.intent && intents.find(({ name }) => name === state.intent);
  if (intent) {
    const intentSlots = intent.slots?.allKeys.map((id) => ({
      ...intent.slots.byKey[id],
      name: slots.find((slot) => slot.id === id)?.name,
    }));

    if (dialog.status === DialogStatus.PROMPT && dialog.slot && intent) {
      const formattedSlots = slotAdapter.mapToDB(slots).map(spreadSynonyms);

      const currentIntentSlot = dialog.slot;
      const extracted = await client.testing.entityExtract({
        input,
        intent: { slots: intent.slots.allKeys },
        slots: formattedSlots,
        curSlot: currentIntentSlot.name,
      });

      state.slots = { ...state.slots, ...extracted.slots };
      dialog.status = null;
      dialog.slot = null;
    }

    const required = intentSlots.find(
      (intentSlot) => intentSlot.required && !(intentSlot.name in state.slots && state.slots[intentSlot.name].value) && intentSlot.dialog.prompt
    );

    if (required) {
      dialog.status = DialogStatus.PROMPT;
      dialog.slot = required;

      state.trace = [await speakTrace(required.dialog.prompt, slots, state.line_id)];
    }
  }

  dispatch(updateDialog(dialog));
  dispatch(updateState(state));
};

export default manageDialog;
