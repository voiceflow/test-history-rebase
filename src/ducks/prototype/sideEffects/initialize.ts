import { constants } from '@voiceflow/common';
import { DEFAULT_INTENTS_MAP } from '@voiceflow/general-types';

import legacyIntentAdapter from '@/client/adapters/legacy/intent';
import legacySlotAdapter from '@/client/adapters/legacy/slot';
import { PlatformType } from '@/constants';
import { allIntentsSelector } from '@/ducks/intent';
import { activeLocalesSelector, activePlatformSelector } from '@/ducks/skill';
import { allSlotsSelector } from '@/ducks/slot';
import { SyncThunk } from '@/store/types';
import { createAndRegister } from '@/utils/nlc';

import { updatePrototype } from '../actions';
import resetState from './reset';

const AUDIO_INTENTS = [
  {
    name: 'AMAZON.PauseIntent',
    samples: ['pause'],
  },
  {
    name: 'AMAZON.ResumeIntent',
    samples: ['resume'],
  },
  {
    name: 'AMAZON.NextIntent',
    samples: ['next'],
  },
  {
    name: 'AMAZON.PreviousIntent',
    samples: ['previous'],
  },
];

export const initializePrototype = (): SyncThunk => (dispatch, getState) => {
  const state = getState();
  const [locale] = activeLocalesSelector(state);
  const platform = activePlatformSelector(state);
  const intents = legacyIntentAdapter.mapToDB(allIntentsSelector(state));
  const slots = legacySlotAdapter.mapToDB(allSlotsSelector(state));
  const isGeneral = platform === PlatformType.GENERAL;
  const lang = locale.slice(0, 2);

  const builtInIntents = isGeneral ? DEFAULT_INTENTS_MAP[lang] : [...constants.intents.DEFAULT_INTENTS[lang].defaults, ...AUDIO_INTENTS];

  const nlc = createAndRegister({ slots, intents, builtInIntents });

  dispatch(updatePrototype({ nlc }));
  dispatch(resetState());
};

export default initializePrototype;
