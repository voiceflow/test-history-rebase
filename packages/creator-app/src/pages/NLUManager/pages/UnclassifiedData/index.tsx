import { useOnScreen } from '@voiceflow/ui';
import React from 'react';

import { useNLUManager } from '@/pages/NLUManager/context';

import { UnclassifiedTabs } from '../../constants';
import EmptyScreen from './components/EmptyScreen';
import { MIN_PAGINATION_ITEMS } from './constants';
import ClusteringView from './pages/ClusteringView';
import UnclassifiedView from './pages/UnclassifiedView';

const UnclassifiedData: React.OldFC = () => {
  const nluManager = useNLUManager();
  const loaderRef = React.useRef<HTMLDivElement>(null);
  const isBottom = useOnScreen(loaderRef);
  const loaderElement = !nluManager.isUnclassifiedDataLoading && nluManager.filteredUtterances.length >= MIN_PAGINATION_ITEMS && (
    <div ref={loaderRef}></div>
  );

  React.useEffect(() => {
    if (isBottom) {
      nluManager.loadMoreUnclassifiedData();
    }
  }, [isBottom]);

  React.useEffect(nluManager.paginateUnclassifiedUtterances, [nluManager.unclassifiedListOrder, nluManager.unclassifiedDataPage]);

  React.useEffect(nluManager.filterUnclassifiedUtterances, [
    nluManager.search,
    nluManager.unclassifiedDataClusters,
    nluManager.clusteredUtterances,
    nluManager.similarCluster,
    nluManager.unclassifiedUtterances,
    nluManager.unclassifiedDataFilters.dataSourceIDs,
    nluManager.unclassifiedDataFilters.dateRange,
  ]);

  React.useEffect(nluManager.fetchClusteringModel, [nluManager.unclassifiedUtterances]);
  React.useEffect(nluManager.resetSimilarClusters, [nluManager.unclassifiedUtterancesByID]);

  if (!nluManager.unclassifiedUtterances.length) return <EmptyScreen />;
  if (nluManager.isClusteringUnclassifiedData || nluManager.selectedUnclassifiedTab === UnclassifiedTabs.UNCLASSIFIED_VIEW)
    return <UnclassifiedView>{loaderElement}</UnclassifiedView>;

  return <ClusteringView>{loaderElement}</ClusteringView>;
};

export default UnclassifiedData;
