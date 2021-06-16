import { prototypeContextHistorySelector } from '@/ducks/prototype';
import { PrototypeContext, Trace } from '@/models';
import { Thunk } from '@/store/types';

export const fetchTranscripts = (): Thunk => async (_dispatch, _getState) => {
  // const state = getState();
  // const projectID = activeProjectIDSelector(state);
  // const { search } = useLocation();
  // const filteredTranscripts = await client.transcript.find(projectID!, search);
};

// Gets the prototype session history and sends it to the save endpoint to save in S3
export const savePrototypeSession = (): Thunk => async (_dispatch, getState) => {
  const state = getState();
  const prototypeContextHistory: Partial<PrototypeContext>[] = prototypeContextHistorySelector(state);
  let allTraces: Trace[] = [];
  prototypeContextHistory?.forEach((context) => {
    if (context.trace) {
      allTraces = [...allTraces, ...context.trace];
    }
  });
};
