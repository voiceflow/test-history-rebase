import { useCachedValue, useSessionStorageState } from '@voiceflow/ui';

import { NLURoute } from '@/config/routes';
import * as Session from '@/ducks/session';
import { useSelector } from '@/hooks';

const NLU_MANAGER_PERSISTED_STATE_KEY = 'NLU_MANAGER_PERSIST_KEY';

interface NLUPersistedState {
  id?: string | null;
  tab: NLURoute;
}

const useNLUPersistedState = (initialState: NLUPersistedState) => {
  const activeProjectID = useSelector(Session.activeProjectIDSelector)!;

  const [nluManagerPersistedState, setNluManagerPersistedState] = useSessionStorageState<NLUPersistedState>(
    `${NLU_MANAGER_PERSISTED_STATE_KEY}-${activeProjectID}`,
    initialState
  );

  const persistedStateRef = useCachedValue(nluManagerPersistedState);

  const updateState = (newState: NLUPersistedState) => {
    persistedStateRef.current = newState;
    setNluManagerPersistedState(newState);
  };

  return { state: persistedStateRef.current, updateState };
};

export default useNLUPersistedState;
