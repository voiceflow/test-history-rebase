import React from 'react';

import { useNLUManager } from '@/pages/NLUManager/context';

import { UnclassifiedTabs } from '../../constants';
import EmptyScreen from './components/EmptyScreen';
import ClusteringView from './pages/ClusteringView';
import UnclassifiedView from './pages/UnclassifiedView';

const UnclassifiedData: React.FC = () => {
  const nluManager = useNLUManager();

  React.useEffect(nluManager.fetchClusteringModel, [nluManager.unclassifiedUtterances]);
  React.useEffect(nluManager.resetSimilarClusters, [nluManager.unclassifiedUtterancesByID]);

  const isUnclassifiedTab = nluManager.selectedUnclassifiedTab === UnclassifiedTabs.UNCLASSIFIED_VIEW;

  if (isUnclassifiedTab && !nluManager.unclassifiedUtterances.length) {
    return <EmptyScreen />;
  }

  return isUnclassifiedTab ? <UnclassifiedView /> : <ClusteringView />;
};

export default UnclassifiedData;
