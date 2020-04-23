import client from '@/client';
import intentAdapter from '@/client/adapters/intent';
import slotAdapter from '@/client/adapters/slot';
import { allIntentsSelector } from '@/ducks/intent';
import { setError } from '@/ducks/modal';
import { activeDiagramIDSelector, activePlatformSelector } from '@/ducks/skill';
import { allSlotsSelector } from '@/ducks/slot';
import { Thunk } from '@/store/types';

import initializeTest from './initialize';

const renderTesting = (): Thunk => async (dispatch, getState) => {
  const state = getState();
  const intents = intentAdapter.mapToDB(allIntentsSelector(state));
  const slots = slotAdapter.mapToDB(allSlotsSelector(state));
  const platform = activePlatformSelector(state);
  const diagramID = activeDiagramIDSelector(state);

  if (diagramID === null) return;

  try {
    await client.testingV2.render(diagramID, {
      intents,
      slots,
      platform,
    });
    dispatch(initializeTest());
  } catch (err) {
    console.error(err);
    dispatch(setError('Could Not Render Your Test Project'));
  }
};

export default renderTesting;
