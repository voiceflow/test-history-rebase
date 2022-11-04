import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import * as NLUDuck from '@/ducks/nlu';
import { useSelector } from '@/hooks';
import { ListOrder } from '@/pages/NLUManager/pages/UnclassifiedData/constants';
import { getUnclassifiedDataMaxRange, getUnclassifiedDataMinRange } from '@/pages/NLUManager/utils';

import { UnclassifiedTabs } from '../constants';
import { useTable } from '../hooks';

export const UNCLASSIFIED_DATA_INTIAL_STATE = {
  unclassifiedUtterances: [],
  filteredUtterances: [],
  activeUnclassifiedUtterance: null,
  selectedUnclassifiedUtteranceIDs: new Set([]),
  toggleSelectedUnclassifiedUtteranceID: Utils.functional.noop,
  selectedUnclassifiedTab: UnclassifiedTabs.LIST_ALL,
  setSelectedUnclassifiedTab: Utils.functional.noop,
  unclassifiedListOrder: ListOrder.NEWEST,
  unclassifiedSetListOrder: Utils.functional.noop,
  unclassifiedDataPage: 0,
  setUnclassifiedDataPage: Utils.functional.noop,
  loadMoreUnclassifiedData: Utils.functional.noop,
  isUnclassifiedDataLoading: false,
};

interface UseNLUEntitiesProps {
  activeItemID: string | null;
  search: string;
  scrollToTop: () => void;
}

const searchUtterances = (utterances: Realtime.NLUUnclassifiedUtterances[], search: string) => {
  return utterances.filter(({ utterance }) => utterance.toLowerCase().includes(search));
};

const useNLUUnclassifiedData = ({ activeItemID, search, scrollToTop }: UseNLUEntitiesProps) => {
  const [unclassifiedListOrder, updateUnclassifiedListOrder] = React.useState<ListOrder>(UNCLASSIFIED_DATA_INTIAL_STATE.unclassifiedListOrder);
  const utterances = useSelector(NLUDuck.allUnclassifiedUtterancesSelector);
  const utterancesByID = useSelector(NLUDuck.utterancesByID);
  const table = useTable(activeItemID);
  const [selectedUnclassifiedTab, setSelectedUnclassifiedTab] = React.useState(UNCLASSIFIED_DATA_INTIAL_STATE.selectedUnclassifiedTab);
  const [unclassifiedDataPage, setUnclassifiedDataPage] = React.useState(UNCLASSIFIED_DATA_INTIAL_STATE.unclassifiedDataPage);
  const [filteredUtterances, setFilteredUtterances] = React.useState(utterances);
  const [isUnclassifiedDataLoading, setIsUnclassifiedDataLoading] = React.useState(false);
  const maxRange = React.useMemo(() => getUnclassifiedDataMaxRange(unclassifiedDataPage, utterances), [unclassifiedDataPage, utterances]);
  const minRange = React.useMemo(() => getUnclassifiedDataMinRange(unclassifiedDataPage), [unclassifiedDataPage]);

  const filterUtterances = (minRange: number, maxRange: number) => {
    const utterancesToSort = search ? searchUtterances(utterances, search) : utterances;

    const sortedUtterances = utterancesToSort
      .slice(minRange, maxRange)
      .sort((a, b) => new Date(b.importedAt).getTime() - new Date(a.importedAt).getTime());

    return unclassifiedListOrder === ListOrder.NEWEST ? sortedUtterances : sortedUtterances.reverse();
  };

  const unclassifiedSetListOrder = (order: ListOrder) => {
    if (order !== unclassifiedListOrder) {
      updateUnclassifiedListOrder(order);
      scrollToTop();
    }
  };

  const handleDataChange = (minRange: number, maxRange: number) => {
    setIsUnclassifiedDataLoading(true);

    // TO DO: Remove this timeout once we integrate with clustering model
    setTimeout(() => {
      setFilteredUtterances(filterUtterances(minRange, maxRange));
      setIsUnclassifiedDataLoading(false);
    }, 300);
  };

  const loadMoreUnclassifiedData = () => {
    handleDataChange(minRange, maxRange + 100);
  };

  React.useEffect(() => {
    handleDataChange(minRange, maxRange);
  }, [utterances, unclassifiedListOrder, unclassifiedDataPage]);

  React.useEffect(() => {
    setFilteredUtterances(filterUtterances(minRange, maxRange));
  }, [search]);

  return {
    unclassifiedUtterances: utterances,
    filteredUtterances,
    activeUnclassifiedUtterance: activeItemID && utterancesByID[activeItemID],
    toggleSelectedUnclassifiedUtteranceID: table.toggleSelectedItemID,
    selectedUnclassifiedUtteranceIDs: table.selectedItemIDs,
    selectedUnclassifiedTab,
    setSelectedUnclassifiedTab,
    unclassifiedListOrder,
    unclassifiedSetListOrder,
    unclassifiedDataPage,
    setUnclassifiedDataPage,
    loadMoreUnclassifiedData,
    isUnclassifiedDataLoading,
  };
};

export default useNLUUnclassifiedData;
