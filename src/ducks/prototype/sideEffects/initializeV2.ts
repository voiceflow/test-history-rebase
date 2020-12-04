import { DEFAULT_INTENTS_MAP } from '@voiceflow/general-types';

import * as Skill from '@/ducks/skill';
import { DBIntent, DBSlot } from '@/models';
import { SyncThunk } from '@/store/types';
import { createAndRegister } from '@/utils/nlc';

import { updatePrototype } from '../actions';
import resetPrototype from './reset';

export const initializePrototypeV2 = ({ slots, intents }: { slots: DBSlot[]; intents: DBIntent[] }): SyncThunk => (dispatch, getState) => {
  const state = getState();
  const [locale] = Skill.activeLocalesSelector(state);

  const lang = locale.slice(0, 2);

  const builtInIntents = DEFAULT_INTENTS_MAP[lang];

  const nlc = createAndRegister({ slots, intents, builtInIntents });

  dispatch(updatePrototype({ nlc }));
  dispatch(resetPrototype());
};

export default initializePrototypeV2;
