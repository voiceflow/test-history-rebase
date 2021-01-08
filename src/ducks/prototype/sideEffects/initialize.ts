import { constants } from '@voiceflow/common';
import { DEFAULT_INTENTS_MAP } from '@voiceflow/general-types';

import intentAdapter from '@/client/adapters/intent';
import slotAdapter from '@/client/adapters/slot';
import { PlatformType } from '@/constants';
import { allIntentsSelector } from '@/ducks/intent';
import { activeLocalesSelector, activePlatformSelector } from '@/ducks/skill';
import { allSlotsSelector } from '@/ducks/slot';
import { SyncThunk } from '@/store/types';
import { createAndRegister } from '@/utils/nlc';

import { updatePrototype } from '../actions';
import resetPrototype from './reset';

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

const getPlatformBuiltInIntents = (lang: string, platform: PlatformType) => {
  const defaultIntents = [...constants.intents.DEFAULT_INTENTS[lang].defaults, ...AUDIO_INTENTS];
  const allPlatformIntents = platform === PlatformType.ALEXA ? constants.intents.BUILT_IN_INTENTS_ALEXA : constants.intents.BUILT_IN_INTENTS_GOOGLE;

  const platformIntents = allPlatformIntents.filter((intent) => !defaultIntents.some((defaultIntent) => defaultIntent.name === intent.name));

  return [...defaultIntents, ...platformIntents];
};

export const initializePrototype = (): SyncThunk => (dispatch, getState) => {
  const state = getState();
  const [locale] = activeLocalesSelector(state);
  const platform = activePlatformSelector(state);
  const intents = intentAdapter(PlatformType.GENERAL).mapToDB(allIntentsSelector(state));
  const slots = slotAdapter.mapToDB(allSlotsSelector(state));
  const isGeneral = platform === PlatformType.GENERAL;
  const lang = locale.slice(0, 2);

  const builtInIntents = isGeneral ? DEFAULT_INTENTS_MAP[lang] : getPlatformBuiltInIntents(lang, platform);

  const nlc = createAndRegister({ slots, intents, builtInIntents });

  dispatch(updatePrototype({ nlc }));
  dispatch(resetPrototype());
};

export default initializePrototype;
