import { Utils } from '@voiceflow/common';
import * as ML from '@voiceflow/ml-sdk';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { PageProgress } from '@/components/PageProgressBar/utils';
import { PageProgressBar } from '@/constants';
import * as NLUDuck from '@/ducks/nlu';
import { useDispatch, useSelector } from '@/hooks';
import useUnclassifiedFindSimilar from '@/pages/NLUManager/hooks/useUnclassifiedFindSimilar';
import useUtteranceClustering from '@/pages/NLUManager/hooks/useUtteranceClustering';
import { ListOrder } from '@/pages/NLUManager/pages/UnclassifiedData/constants';
import { DateRangeTypes, UnclassifiedDataCluster, UnclassifiedViewFilters } from '@/pages/NLUManager/pages/UnclassifiedData/types';
import { mapClusteringData } from '@/pages/NLUManager/pages/UnclassifiedData/utils';
import { getUnclassifiedDataMaxRange, searchUtterances } from '@/pages/NLUManager/utils';

import { UnclassifiedTabs } from '../constants';
import useTable from '../hooks/useTable';

export const UNCLASSIFIED_DATA_INTIAL_STATE = {
  unclassifiedUtterances: [],
  filteredUtterances: [],
  activeUnclassifiedUtterance: null,
  selectedUnclassifiedUtteranceIDs: new Set([]),
  toggleSelectedUnclassifiedUtteranceID: Utils.functional.noop,
  selectedUnclassifiedTab: UnclassifiedTabs.UNCLASSIFIED_VIEW,
  changeUnclassifiedPageTab: async () => {},
  unclassifiedListOrder: ListOrder.NEWEST,
  unclassifiedSetListOrder: Utils.functional.noop,
  unclassifiedDataPage: 0,
  setUnclassifiedDataPage: Utils.functional.noop,
  loadMoreUnclassifiedData: async () => {},
  isUnclassifiedDataLoading: false,
  selectedClusterIDs: new Set<string>([]),
  toggleClusterSelection: Utils.functional.noop,
  isClusteringUnclassifiedData: false,
  clusterUnclassifiedData: async () => {},
  unclassifiedDataClusters: [],
  resetSelectedUnclassifiedData: Utils.functional.noop,
  setSelectedClusterIDs: Utils.functional.noop,
  setSelectedUnclassifiedUtteranceIDs: Utils.functional.noop,
  totalUnclassifiedItems: 0,
  similarityScores: null as Record<string, number> | null,
  findSimilar: async () => {},
  isFindingSimilar: false,
  similarCluster: null as UnclassifiedDataCluster | null,
  clusteringData: null as ML.unclassified.ClusteringData | null,
  isClusteringDataLoading: false,
  assignUnclassifiedUtterancesToIntent: async () => {},
  deleteUnclassifiedUtterances: async () => {},
  updateUnclassifiedUtterances: async () => {},
  unclassifiedDataFilters: { dateRange: DateRangeTypes.ALL_TIME, dataSourceIDs: [] } as UnclassifiedViewFilters,
  setUnclassifiedDataFilters: Utils.functional.noop,
};

interface UseNLUEntitiesProps {
  activeItemID: string | null;
  search: string;
  scrollToTop: () => void;
}

const useNLUUnclassifiedData = ({ activeItemID, search, scrollToTop }: UseNLUEntitiesProps) => {
  const [unclassifiedListOrder, updateUnclassifiedListOrder] = React.useState<ListOrder>(UNCLASSIFIED_DATA_INTIAL_STATE.unclassifiedListOrder);
  const utterances = useSelector(NLUDuck.allUnclassifiedUtterancesSelector);
  const utterancesByID = useSelector(NLUDuck.utterancesByID);
  const table = useTable(activeItemID);
  const [selectedUnclassifiedTab, setSelectedUnclassifiedTab] = React.useState(UNCLASSIFIED_DATA_INTIAL_STATE.selectedUnclassifiedTab);
  const [unclassifiedDataPage, setUnclassifiedDataPage] = React.useState(UNCLASSIFIED_DATA_INTIAL_STATE.unclassifiedDataPage);
  const [filteredUtterances, setFilteredUtterances] = React.useState<Realtime.NLUUnclassifiedUtterances[]>(utterances);
  const [isUnclassifiedDataLoading, setIsUnclassifiedDataLoading] = React.useState(false);
  const [clusteredUtterances, setClusteredUtterances] = React.useState<Record<string, string>>({});
  const assignUnclassifiedUtterancesToIntent = useDispatch(NLUDuck.assignUtterancesToIntent);
  const deleteUnclassifiedUtterances = useDispatch(NLUDuck.deleteUtterances);
  const updateUnclassifiedUtterances = useDispatch(NLUDuck.updateUtterances);
  const [unclassifiedDataFilters, setUnclassifiedDataFilters] = React.useState<UnclassifiedViewFilters>(
    UNCLASSIFIED_DATA_INTIAL_STATE.unclassifiedDataFilters
  );

  const { findSimilarUtterances, similarityScores, setSimilarityScores } = useUnclassifiedFindSimilar();
  const [isFindingSimilar, setIsFindingSimilar] = React.useState(UNCLASSIFIED_DATA_INTIAL_STATE.isFindingSimilar);

  const { clusterUtterances, clusteringData, isClusteringDataLoading } = useUtteranceClustering();
  const [unclassifiedDataClusters, setUnclassifiedDataClusters] = React.useState<UnclassifiedDataCluster[]>([]);
  const [selectedClusterIDs, setSelectedClusterIDs] = React.useState(UNCLASSIFIED_DATA_INTIAL_STATE.selectedClusterIDs);
  const [isClusteringUnclassifiedData, setIsClusteringUnclassifiedData] = React.useState(false);

  const similarCluster =
    unclassifiedDataClusters?.length === 1 && Object.keys(similarityScores || {}).length > 0 ? unclassifiedDataClusters[0] : null;

  const toggleClusterSelection = (clusterID: string) => {
    if (selectedClusterIDs.has(clusterID)) {
      const newClusters = selectedClusterIDs;
      newClusters.delete(clusterID);
      setSelectedClusterIDs(new Set(Array.from(newClusters)));
      return;
    }

    setSelectedClusterIDs(new Set([...selectedClusterIDs, clusterID]));
  };

  const totalUnclassifiedItems = React.useMemo(() => {
    if (selectedUnclassifiedTab === UnclassifiedTabs.CLUSTERING_VIEW && unclassifiedDataClusters) {
      const unclassifiedUtterances = utterances.filter((u) => !clusteredUtterances[u.utterance]);
      return unclassifiedDataClusters.length + unclassifiedUtterances.length;
    }

    return utterances.length;
  }, [selectedUnclassifiedTab, utterances, unclassifiedDataClusters, clusteredUtterances]);

  const clusterUnclassifiedData = async () => {
    if (utterances.length === 0) return;

    setIsClusteringUnclassifiedData(true);
    PageProgress.start(PageProgressBar.NLU_CLUSTERING);

    try {
      const clusteringData = await clusterUtterances();

      if (clusteringData) {
        const { clusters, clusteredUtterances } = mapClusteringData(clusteringData, utterances);
        setUnclassifiedDataClusters(clusters);
        setClusteredUtterances(clusteredUtterances);
      }
    } finally {
      setIsClusteringUnclassifiedData(false);
      PageProgress.stop(PageProgressBar.NLU_CLUSTERING);
    }
  };

  const changeUnclassifiedPageTab = async (tab: UnclassifiedTabs) => {
    setSelectedUnclassifiedTab(tab);
    setIsUnclassifiedDataLoading(true);

    if (tab === UnclassifiedTabs.CLUSTERING_VIEW) {
      await clusterUnclassifiedData();
    } else {
      setClusteredUtterances({} as any);
    }

    scrollToTop();
    resetSelectedUnclassifiedData();
    setIsUnclassifiedDataLoading(false);
  };

  const filterUtterances = (maxRange: number) => {
    const unclusteredUtterances = utterances.filter((u) => {
      if (!u.id) return true;
      if (selectedUnclassifiedTab === UnclassifiedTabs.CLUSTERING_VIEW && !clusteredUtterances[u.id]) return false;
      if (similarCluster && similarCluster?.utteranceIDs.includes(u.id)) return false;
      return true;
    });

    const utterancesToSort = searchUtterances(unclusteredUtterances, search, unclassifiedDataFilters);

    if (similarityScores) {
      return utterancesToSort
        .sort((a, b) => {
          const aScore = similarityScores[a.id];
          const bScore = similarityScores[b.id];

          if (!aScore && !bScore) return 0;
          if (!aScore) return 1;
          if (!bScore) return -1;
          return bScore - aScore;
        })
        .slice(0, maxRange);
    }

    const sortedUtterances = utterancesToSort.sort((a, b) => new Date(b.importedAt).getTime() - new Date(a.importedAt).getTime()).slice(0, maxRange);

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

  const loadMoreUnclassifiedData = async () => {
    const maxRange = getUnclassifiedDataMaxRange(unclassifiedDataPage);
    const newPage = unclassifiedDataPage + 1;
    const newMaxRange = getUnclassifiedDataMaxRange(newPage);

    if (newMaxRange <= utterances.length && maxRange !== utterances.length) {
      setUnclassifiedDataPage(newPage);
    }
  };

  const resetSelectedUnclassifiedData = () => {
    setIsFindingSimilar(false);
    setSimilarityScores(null);
    table.setSelectedItemIDs([]);
    setSelectedClusterIDs(new Set([]));
  };

  const unclassifiedSetListOrder = (order: ListOrder) => {
    if (order !== unclassifiedListOrder) {
      updateUnclassifiedListOrder(order);
      scrollToTop();
    }
  };

  const toggleSelectedUnclassifiedUtteranceID = (itemID: string | null) => {
    if (!itemID || similarCluster?.utteranceIDs.includes(itemID)) {
      setSimilarityScores(null);
      setIsFindingSimilar(false);
      table.setSelectedItemIDs([]);
      return;
    }

    if (table.selectedItemIDs.size > 0 && similarCluster?.utteranceIDs && similarCluster?.utteranceIDs?.length > 0) {
      setUnclassifiedDataClusters([
        {
          ...similarCluster,
          utteranceIDs: [itemID, ...similarCluster.utteranceIDs],
        },
      ]);
    } else {
      setSimilarityScores(null);
      setIsFindingSimilar(false);
      table.toggleSelectedItemID(itemID);
    }
  };

  const findSimilar = async () => {
    if (isFindingSimilar) {
      setSimilarityScores(null);
      setIsFindingSimilar(false);
      return;
    }

    setIsFindingSimilar(true);
    const selectedIds = Array.from(table.selectedItemIDs);
    const firstUtterance = utterancesByID[selectedIds[0]];
    const targetPhrase = firstUtterance.utterance;
    setIsUnclassifiedDataLoading(true);

    try {
      await findSimilarUtterances(targetPhrase);
      setUnclassifiedDataClusters([
        {
          id: '1',
          name: firstUtterance.utterance,
          utteranceIDs: selectedIds,
        },
      ]);
    } finally {
      setIsUnclassifiedDataLoading(false);
    }
  };

  const resetClusters = () => {
    const allUtteranceIDsSet = new Set(Object.keys(utterancesByID));
    const clusters = unclassifiedDataClusters
      .map((c) => ({ ...c, utteranceIDs: c.utteranceIDs.filter((id) => allUtteranceIDsSet.has(id)) }))
      .filter((c) => c.utteranceIDs.length > 0);

    const updatedClusteredUtterances = Object.entries(clusteredUtterances).reduce<Record<string, string>>(
      (acc, [id, intentID]) => (!allUtteranceIDsSet.has(id) ? acc : { ...acc, [id]: intentID }),
      {}
    );

    setUnclassifiedDataClusters(clusters);
    setClusteredUtterances(updatedClusteredUtterances);

    if (clusters.length === 0) {
      setSelectedUnclassifiedTab(UnclassifiedTabs.UNCLASSIFIED_VIEW);
    }
  };

  React.useEffect(() => {
    const maxRange = getUnclassifiedDataMaxRange(unclassifiedDataPage);
    handleDataChange(maxRange);
  }, [unclassifiedListOrder, unclassifiedDataPage]);

  React.useEffect(() => {
    const maxRange = getUnclassifiedDataMaxRange(unclassifiedDataPage);
    setFilteredUtterances(filterUtterances(maxRange));
  }, [
    search,
    unclassifiedDataClusters,
    clusteredUtterances,
    similarCluster,
    utterances,
    unclassifiedDataFilters.dataSourceIDs,
    unclassifiedDataFilters.dateRange,
  ]);

  React.useEffect(() => {
    clusterUtterances();
    const utteranceIDs = new Set(utterances.map((u) => u.id));
    table.setSelectedItemIDs(Array.from(table.selectedItemIDs).filter((id) => utteranceIDs.has(id)));
  }, [utterances]);

  React.useEffect(() => {
    resetClusters();
  }, [utterancesByID]);

  return {
    totalUnclassifiedItems,
    unclassifiedUtterances: utterances,
    filteredUtterances,
    activeUnclassifiedUtterance: table.selectedItemIDs.size >= 1 ? utterancesByID[Array.from(table.selectedItemIDs)[0]] : null,
    toggleSelectedUnclassifiedUtteranceID,
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
    findSimilar,
    similarityScores,
    similarCluster,
    setSelectedClusterIDs,
    setSelectedUnclassifiedUtteranceIDs: table.setSelectedItemIDs,
    isFindingSimilar,
    clusteringData,
    isClusteringDataLoading,
    assignUnclassifiedUtterancesToIntent,
    deleteUnclassifiedUtterances,
    unclassifiedDataFilters,
    setUnclassifiedDataFilters,
    updateUnclassifiedUtterances,
  };
};

export default useNLUUnclassifiedData;
