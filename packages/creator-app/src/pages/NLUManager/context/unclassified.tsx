import { Utils } from '@voiceflow/common';

import * as NLUDuck from '@/ducks/nlu';
import { useSelector } from '@/hooks';

import { useTable } from '../hooks';

export const UNCLASSIFIED_DATA_INTIAL_STATE = {
  unclassifiedUtterances: [],
  activeUnclassifiedUtterance: null,
  selectedUnclassifiedUtteranceIDs: new Set([]),
  toggleSelectedUnclassifiedUtteranceID: Utils.functional.noop,
};

interface UseNLUEntitiesProps {
  activeItemID: string | null;
}

const useNLUUnclassifiedData = ({ activeItemID }: UseNLUEntitiesProps) => {
  const utterances = useSelector(NLUDuck.allUnclassifiedUtterancesSelector);
  const utterancesByID = useSelector(NLUDuck.utterancesByID);
  const table = useTable(activeItemID);

  return {
    unclassifiedUtterances: utterances,
    activeUnclassifiedUtterance: activeItemID && utterancesByID[activeItemID],
    toggleSelectedUnclassifiedUtteranceID: table.toggleSelectedItemID,
    selectedUnclassifiedUtteranceIDs: table.selectedItemIDs,
  };
};

export default useNLUUnclassifiedData;
