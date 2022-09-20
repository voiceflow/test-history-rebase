import React from 'react';

import EmptyView from '@/pages/Canvas/components/NLUQuickView/components/EmptyView';
import { useNLUManager } from '@/pages/NLUManager/context';

import NoResultsScreen from './NoResultsScreen';

const EmptyScreen: React.FC = () => {
  const nluManager = useNLUManager();

  if (nluManager.search) {
    return <NoResultsScreen itemName={nluManager.activeTab} onCleanFilters={() => nluManager.setSearch('')} />;
  }

  return <EmptyView pageType={nluManager.activeTab} onCreate={() => nluManager.createAndGoToItem(nluManager.search)} />;
};

export default EmptyScreen;
