import { Utils } from '@voiceflow/common';
import * as ML from '@voiceflow/ml-sdk';
import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import { PageProgress } from '@/components/PageProgressBar';
import { PageProgressBar } from '@/constants';
import * as NLUDuck from '@/ducks/nlu';
import { useDispatch, useSelector } from '@/hooks';
import useUnclassifiedFindSimilar from '@/pages/NLUManager/hooks/useUnclassifiedFindSimilar';
import useUtteranceClustering from '@/pages/NLUManager/hooks/useUtteranceClustering';
import { ListOrder } from '@/pages/NLUManager/pages/UnclassifiedData/constants';
import { DateRangeTypes, UnclassifiedDataCluster, UnclassifiedViewFilters } from '@/pages/NLUManager/pages/UnclassifiedData/types';
import { mapClusteringData } from '@/pages/NLUManager/pages/UnclassifiedData/utils';
import { searchUtterances } from '@/pages/NLUManager/utils';

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
  unclassifiedUtterancesByID: {},
  resetSimilarClusters: Utils.functional.noop,
  filterUnclassifiedUtterances: Utils.functional.noop,
  fetchClusteringModel: Utils.functional.noop,
  clusteredUtterances: {},
  openedUnclassifiedUtteranceID: null,
  setOpenedUnclassifiedUtteranceID: Utils.functional.noop,
};

interface UseNLUEntitiesProps {
  search: string;
  activeItemID: string | null;
  scrollToTop: () => void;
  setIsScrolling: React.Dispatch<React.SetStateAction<boolean>>;
}

const useNLUUnclassifiedData = ({ activeItemID, search, scrollToTop, setIsScrolling }: UseNLUEntitiesProps) => {
  const [unclassifiedListOrder, updateUnclassifiedListOrder] = React.useState<ListOrder>(UNCLASSIFIED_DATA_INTIAL_STATE.unclassifiedListOrder);
  const utterances = useSelector(NLUDuck.allUnclassifiedUtterancesSelector);
  const utterancesByID = useSelector(NLUDuck.unclassifiedUtteranceByIDSelector);
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

  const [openedUnclassifiedUtteranceID, setOpenedUnclassifiedUtteranceID] = React.useState<string | null>(null);

  const { findSimilarUtterances, similarityScores, setSimilarityScores } = useUnclassifiedFindSimilar();
  const [isFindingSimilar, setIsFindingSimilar] = React.useState(UNCLASSIFIED_DATA_INTIAL_STATE.isFindingSimilar);

  const { clusterUtterances, clusteringData, isClusteringDataLoading } = useUtteranceClustering();
  const [unclassifiedDataClusters, setUnclassifiedDataClusters] = React.useState<UnclassifiedDataCluster[]>([]);
  const [selectedClusterIDs, setSelectedClusterIDs] = React.useState(UNCLASSIFIED_DATA_INTIAL_STATE.selectedClusterIDs);
  const [isClusteringUnclassifiedData, setIsClusteringUnclassifiedData] = React.useState(false);

  const similarCluster =
    unclassifiedDataClusters?.length === 1 && Object.keys(similarityScores || {}).length > 0 ? unclassifiedDataClusters[0] : null;

  const updateUnclassifiedDataClusters = (clusters: UnclassifiedDataCluster[]) => {
    setUnclassifiedDataClusters(clusters.sort((a, b) => b.utteranceIDs.length - a.utteranceIDs.length));
  };

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

  const startMLRequestProgressBar = () => {
    let expectedTimeSeconds = utterances.length / 100;

    if (utterances.length < 30) {
      expectedTimeSeconds = 1;
    }

    if (utterances.length > 5000) {
      expectedTimeSeconds = utterances.length / 50;
    }

    // 1000ms of buffer
    const expectedTimeMs = expectedTimeSeconds * 1000 + 1000;

    PageProgress.start(PageProgressBar.NLU_UNCLASSIFIED, { maxDuration: expectedTimeMs, step: 1, stepInterval: 100, timeout: expectedTimeMs });
  };

  const stopMLRequestProgressBar = () => {
    PageProgress.stop(PageProgressBar.NLU_UNCLASSIFIED);
  };

  const clusterUnclassifiedData = async () => {
    if (utterances.length === 0) return;

    startMLRequestProgressBar();
    setIsClusteringUnclassifiedData(true);

    try {
      const clusteringData = await clusterUtterances();

      if (clusteringData) {
        const { clusters, clusteredUtterances } = mapClusteringData(clusteringData, utterances);
        updateUnclassifiedDataClusters(clusters);
        setClusteredUtterances(clusteredUtterances);
      }
    } finally {
      stopMLRequestProgressBar();
      setIsClusteringUnclassifiedData(false);
    }
  };

  const changeUnclassifiedPageTab = async (tab: UnclassifiedTabs) => {
    setIsScrolling(false);
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

  const getFilteredUtterances = () => {
    const unclusteredUtterances = utterances.filter((u) => {
      if (!u.id) return true;
      if (selectedUnclassifiedTab === UnclassifiedTabs.CLUSTERING_VIEW && !clusteredUtterances[u.id]) return false;
      if (similarCluster && similarCluster?.utteranceIDs.includes(u.id)) return false;
      return true;
    });

    const utterancesToSort = searchUtterances(unclusteredUtterances, search, unclassifiedDataFilters);

    if (similarityScores) {
      return utterancesToSort.sort((a, b) => {
        const aScore = similarityScores[a.id];
        const bScore = similarityScores[b.id];

        if (!aScore && !bScore) return 0;
        if (!aScore) return 1;
        if (!bScore) return -1;
        return bScore - aScore;
      });
    }

    const sortedUtterances = utterancesToSort.sort((a, b) => new Date(b.importedAt).getTime() - new Date(a.importedAt).getTime());

    return unclassifiedListOrder === ListOrder.NEWEST ? sortedUtterances : sortedUtterances.reverse();
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
      updateUnclassifiedDataClusters([
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

    startMLRequestProgressBar();
    setIsFindingSimilar(true);
    const selectedIds = Array.from(table.selectedItemIDs);
    const firstUtterance = utterancesByID[selectedIds[0]];
    const targetPhrase = firstUtterance.utterance;
    setIsUnclassifiedDataLoading(true);

    try {
      await findSimilarUtterances(targetPhrase);
      updateUnclassifiedDataClusters([
        {
          id: '1',
          name: firstUtterance.utterance,
          utteranceIDs: selectedIds,
        },
      ]);
    } finally {
      setIsUnclassifiedDataLoading(false);
      stopMLRequestProgressBar();
    }
  };

  const resetSimilarClusters = () => {
    const allUtteranceIDsSet = new Set(Object.keys(utterancesByID));
    const clusters = unclassifiedDataClusters
      .map((c) => ({ ...c, utteranceIDs: c.utteranceIDs.filter((id) => allUtteranceIDsSet.has(id)) }))
      .filter((c) => c.utteranceIDs.length > 0);

    const updatedClusteredUtterances = Object.entries(clusteredUtterances).reduce<Record<string, string>>(
      (acc, [id, intentID]) => (!allUtteranceIDsSet.has(id) ? acc : { ...acc, [id]: intentID }),
      {}
    );

    updateUnclassifiedDataClusters(clusters);
    setClusteredUtterances(updatedClusteredUtterances);

    if (clusters.length === 0) {
      setSelectedUnclassifiedTab(UnclassifiedTabs.UNCLASSIFIED_VIEW);
    }
  };

  const filterUnclassifiedUtterances = () => {
    setFilteredUtterances(getFilteredUtterances());
  };

  const fetchClusteringModel = () => {
    clusterUtterances();
    const utteranceIDs = new Set(utterances.map((u) => u.id));
    table.setSelectedItemIDs(Array.from(table.selectedItemIDs).filter((id) => utteranceIDs.has(id)));
  };

  React.useEffect(filterUnclassifiedUtterances, [
    // filters
    search,
    unclassifiedDataFilters,

    // clusters
    clusteredUtterances,
    similarCluster,

    // unclassified
    utterances,
  ]);

  return {
    totalUnclassifiedItems,
    unclassifiedUtterances: utterances,
    unclassifiedUtterancesByID: utterancesByID,
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
    clusteredUtterances,
    openedUnclassifiedUtteranceID,
    setOpenedUnclassifiedUtteranceID,

    // effects
    resetSimilarClusters,
    filterUnclassifiedUtterances,
    fetchClusteringModel,
  };
};

export default useNLUUnclassifiedData;
