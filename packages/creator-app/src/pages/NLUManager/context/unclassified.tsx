import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { PageProgress } from '@/components/PageProgressBar/utils';
import { PageProgressBar } from '@/constants';
import * as NLUDuck from '@/ducks/nlu';
import { useSelector } from '@/hooks';
import { ListOrder, UNCLASSIFIED_DATA_CLUSTERS } from '@/pages/NLUManager/pages/UnclassifiedData/constants';
import { UnclassifiedDataCluster } from '@/pages/NLUManager/pages/UnclassifiedData/types';
import { getUnclassifiedDataMaxRange } from '@/pages/NLUManager/utils';

import { UnclassifiedTabs } from '../constants';
import { useTable } from '../hooks';

export const UNCLASSIFIED_DATA_INTIAL_STATE = {
  unclassifiedUtterances: [],
  filteredUtterances: [],
  activeUnclassifiedUtterance: null,
  selectedUnclassifiedUtteranceIDs: new Set([]),
  toggleSelectedUnclassifiedUtteranceID: Utils.functional.noop,
  selectedUnclassifiedTab: UnclassifiedTabs.UNCLASSIFIED_VIEW,
  changeUnclassifiedPageTab: Utils.functional.noop,
  unclassifiedListOrder: ListOrder.NEWEST,
  unclassifiedSetListOrder: Utils.functional.noop,
  unclassifiedDataPage: 0,
  setUnclassifiedDataPage: Utils.functional.noop,
  loadMoreUnclassifiedData: Utils.functional.noop,
  isUnclassifiedDataLoading: false,
  selectedClusterIDs: new Set<string>([]),
  toggleClusterSelection: Utils.functional.noop,
  isClusteringUnclassifiedData: false,
  clusterUnclassifiedData: Utils.functional.noop,
  unclassifiedDataClusters: [],
  resetSelectedUnclassifiedData: Utils.functional.noop,
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

  const [unclassifiedDataClusters, setUnclassifiedDataClusters] = React.useState<UnclassifiedDataCluster[]>([]);
  const [selectedClusterIDs, setSelectedClusterIDs] = React.useState(UNCLASSIFIED_DATA_INTIAL_STATE.selectedClusterIDs);
  const [isClusteringUnclassifiedData, setIsClusteringUnclassifiedData] = React.useState(false);

  const toggleClusterSelection = (clusterID: string) => {
    if (selectedClusterIDs.has(clusterID)) {
      const newClusters = selectedClusterIDs;
      newClusters.delete(clusterID);
      setSelectedClusterIDs(new Set(Array.from(newClusters)));
      return;
    }

    setSelectedClusterIDs(new Set([...selectedClusterIDs, clusterID]));
  };

  // TO DO: Remove this timeout once we integrate with clustering model
  const clusterUnclassifiedData = () => {
    setIsClusteringUnclassifiedData(true);
    PageProgress.start(PageProgressBar.NLU_CLUSTERING);

    setTimeout(() => {
      setUnclassifiedDataClusters(UNCLASSIFIED_DATA_CLUSTERS);
      setIsClusteringUnclassifiedData(false);
      PageProgress.stop(PageProgressBar.NLU_CLUSTERING);
    }, 1000);
  };

  const changeUnclassifiedPageTab = (tab: UnclassifiedTabs) => {
    if (tab === UnclassifiedTabs.CLUSTERING_VIEW) {
      clusterUnclassifiedData();
    }

    setSelectedUnclassifiedTab(tab);
    scrollToTop();
    resetSelectedUnclassifiedData();
  };

  const filterUtterances = (maxRange: number) => {
    const utterancesToSort = search ? searchUtterances(utterances, search) : utterances;

    const sortedUtterances = utterancesToSort.slice(0, maxRange).sort((a, b) => new Date(b.importedAt).getTime() - new Date(a.importedAt).getTime());

    return unclassifiedListOrder === ListOrder.NEWEST ? sortedUtterances : sortedUtterances.reverse();
  };

  const handleDataChange = (maxRange: number) => {
    setIsUnclassifiedDataLoading(true);

    // TO DO: Remove this timeout once we integrate with clustering model
    setTimeout(() => {
      setFilteredUtterances(filterUtterances(maxRange));
      setIsUnclassifiedDataLoading(false);
    }, 300);
  };

  const loadMoreUnclassifiedData = () => {
    const maxRange = getUnclassifiedDataMaxRange(unclassifiedDataPage);
    const newPage = unclassifiedDataPage + 1;
    const newMaxRange = getUnclassifiedDataMaxRange(newPage);

    if (newMaxRange <= utterances.length && maxRange !== utterances.length) {
      setUnclassifiedDataPage(newPage);
    }
  };

  const resetSelectedUnclassifiedData = () => {
    table.setSelectedItemIDs([]);
    setSelectedClusterIDs(new Set([]));
  };

  const unclassifiedSetListOrder = (order: ListOrder) => {
    if (order !== unclassifiedListOrder) {
      updateUnclassifiedListOrder(order);
      scrollToTop();
    }
  };

  React.useEffect(() => {
    const maxRange = getUnclassifiedDataMaxRange(unclassifiedDataPage);
    handleDataChange(maxRange);
  }, [unclassifiedListOrder, unclassifiedDataPage]);

  React.useEffect(() => {
    const maxRange = getUnclassifiedDataMaxRange(unclassifiedDataPage);
    setFilteredUtterances(filterUtterances(maxRange));
  }, [search]);

  return {
    unclassifiedUtterances: utterances,
    filteredUtterances,
    activeUnclassifiedUtterance: activeItemID && utterancesByID[activeItemID],
    toggleSelectedUnclassifiedUtteranceID: table.toggleSelectedItemID,
    selectedUnclassifiedUtteranceIDs: table.selectedItemIDs,
    selectedUnclassifiedTab,
    changeUnclassifiedPageTab,
    unclassifiedListOrder,
    unclassifiedSetListOrder,
    unclassifiedDataPage,
    setUnclassifiedDataPage,
    loadMoreUnclassifiedData,
    isUnclassifiedDataLoading,
    selectedClusterIDs,
    toggleClusterSelection,
    isClusteringUnclassifiedData,
    clusterUnclassifiedData,
    unclassifiedDataClusters,
    resetSelectedUnclassifiedData,
  };
};

export default useNLUUnclassifiedData;
