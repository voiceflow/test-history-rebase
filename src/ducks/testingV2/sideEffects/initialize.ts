import intentAdapter from '@/client/adapters/intent';
import slotAdapter from '@/client/adapters/slot';
import { allIntentsSelector } from '@/ducks/intent';
import { activeLocalesSelector } from '@/ducks/skill';
import { allSlotsSelector } from '@/ducks/slot';
import { SyncThunk } from '@/store/types';
import { createAndRegister } from '@/utils/nlc';

import { updateTesting } from '../actions';
import resetState from './reset';

export const initializeTest = (): SyncThunk => (dispatch, getState) => {
  const state = getState();
  const [locale] = activeLocalesSelector(state);
  const intents = intentAdapter.mapToDB(allIntentsSelector(state));
  const slots = slotAdapter.mapToDB(allSlotsSelector(state));

  const nlc = createAndRegister({ slots, intents, language: locale });

  dispatch(updateTesting({ nlc }));
  dispatch(resetState());
};

export default initializeTest;
