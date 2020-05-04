import intentAdapter from '@/client/adapters/intent';
import slotAdapter from '@/client/adapters/slot';
import { allIntentsSelector } from '@/ducks/intent';
import { activeLocalesSelector } from '@/ducks/skill';
import { allSlotsSelector } from '@/ducks/slot';
import { SyncThunk } from '@/store/types';
import { createAndRegister } from '@/utils/nlc';

import { updatePrototype } from '../actions';
import resetState from './reset';

export const initializePrototype = (): SyncThunk => (dispatch, getState) => {
  const state = getState();
  const [locale] = activeLocalesSelector(state);
  const intents = intentAdapter.mapToDB(allIntentsSelector(state));
  const slots = slotAdapter.mapToDB(allSlotsSelector(state));

  const nlc = createAndRegister({ slots, intents, language: locale });

  dispatch(updatePrototype({ nlc }));
  dispatch(resetState());
};

export default initializePrototype;
