import { Utils } from '@voiceflow/common';
import React from 'react';

import { InteractionModelTabType } from '@/constants';
import * as Tracking from '@/ducks/tracking';
import { useOrderedIntents } from '@/hooks/intent';
import { useCreateIntentModal } from '@/ModalsV2/hooks';

import useClarity from '../hooks/useClarity';
import useNLUTable from '../hooks/useNLUTable';
import useNotifications from '../hooks/useNotifications';

export const INTENTS_INTIAL_STATE = {
  intents: [],
  activeIntent: null,
  clarity: null,
  notifications: [],
  fetchClarity: Utils.functional.noop as any,
  isFetchingClarity: false,
  createIntent: Utils.functional.noop as any,
  deleteIntent: Utils.functional.noop as any,
  deleteIntents: Utils.functional.noop as any,
  renamingIntentID: '',
  selectedIntentIDs: new Set([]),
  toggleSelectedIntentID: Utils.functional.noop,
  setRenamingIntentID: Utils.functional.noop,
  setSelectedIntentIDs: Utils.functional.noop,
};

interface UseNLUIntentsProps {
  activeItemID: string | null;
  goToItem: (id: string | null) => void;
}

const REFRESH_CLARITY_TIMEOUT = 5000;

const useNLUIntents = ({ activeItemID, goToItem }: UseNLUIntentsProps) => {
  const orderedIntents = useOrderedIntents();
  const { fetchClarity, clarity, nluIntents, isFetching: isFetchingClarity } = useClarity(orderedIntents);
  const notifications = useNotifications(nluIntents);
  const createIntentModal = useCreateIntentModal();
  const timeout = React.useRef<number>();

  const { deleteItem, deleteItems, renamingItemID, selectedItemIDs, setRenamingItemID, setSelectedItemIDs, toggleSelectedItemID } = useNLUTable(
    InteractionModelTabType.INTENTS,
    activeItemID,
    goToItem
  );

  const intentsMap = React.useMemo(() => Utils.array.createMap(Utils.array.inferUnion(nluIntents), (intent) => intent.id), [nluIntents]);

  const createIntent = async (name?: string) => {
    try {
      const { intentID } = await createIntentModal.open({ name, creationType: Tracking.CanvasCreationType.NLU_MANAGER });

      goToItem(intentID);
    } catch {
      // closed
    }
  };

  const refreshClarity = () => {
    if (!clarity) {
      fetchClarity();
      return;
    }

    clearTimeout(timeout.current);
    timeout.current = window.setTimeout(fetchClarity, REFRESH_CLARITY_TIMEOUT);
  };

  React.useEffect(refreshClarity, [orderedIntents]);

  return {
    // state
    intents: nluIntents,
    activeIntent: activeItemID ? intentsMap[activeItemID] : null,

    // conflicts
    clarity,
    notifications,
    fetchClarity,
    isFetchingClarity,

    // actions
    createIntent,
    deleteIntent: deleteItem,
    deleteIntents: deleteItems,
    renamingIntentID: renamingItemID,
    selectedIntentIDs: selectedItemIDs,
    setRenamingIntentID: setRenamingItemID,
    setSelectedIntentIDs: setSelectedItemIDs,
    toggleSelectedIntentID: toggleSelectedItemID,
  };
};

export default useNLUIntents;
