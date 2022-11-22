import { useOnScreen } from '@voiceflow/ui';
import React from 'react';

import { useNLUManager } from '@/pages/NLUManager/context';

import { UnclassifiedTabs } from '../../constants';
import EmptyScreen from './components/EmptyScreen';
import { MIN_PAGINATION_ITEMS } from './constants';
import ClusteringView from './pages/ClusteringView';
import UnclassifiedView from './pages/UnclassifiedView';

const UnclassifiedData: React.FC = () => {
  const {
    selectedUnclassifiedTab,
    unclassifiedUtterances,
    isClusteringUnclassifiedData,
    loadMoreUnclassifiedData,
    filteredUtterances,
    isUnclassifiedDataLoading,
  } = useNLUManager();
  const loaderRef = React.useRef<HTMLDivElement>(null);
  const isBottom = useOnScreen(loaderRef);
  const loaderElement = !isUnclassifiedDataLoading && filteredUtterances.length >= MIN_PAGINATION_ITEMS && <div ref={loaderRef}></div>;

  React.useEffect(() => {
    if (isBottom) {
      loadMoreUnclassifiedData();
    }
  }, [isBottom]);

  if (!unclassifiedUtterances.length) return <EmptyScreen />;
  if (isClusteringUnclassifiedData || selectedUnclassifiedTab === UnclassifiedTabs.UNCLASSIFIED_VIEW)
    return <UnclassifiedView>{loaderElement}</UnclassifiedView>;

  return <ClusteringView>{loaderElement}</ClusteringView>;
};

export default UnclassifiedData;
