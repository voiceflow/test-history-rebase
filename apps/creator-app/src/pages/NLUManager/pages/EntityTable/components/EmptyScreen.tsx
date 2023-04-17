import React from 'react';

import EmptyView from '@/pages/NLUManager/components/EmptyView';
import NoResultsScreen from '@/pages/NLUManager/components/NoResultsScreen';
import { useNLUManager } from '@/pages/NLUManager/context';

const EmptyScreen: React.FC = () => {
  const nluManager = useNLUManager();

  if (nluManager.search) {
    return <NoResultsScreen itemName="entities" onCleanFilters={() => nluManager.setSearch('')} />;
  }

  return <EmptyView tab={nluManager.activeTab} onCreate={() => nluManager.createEntity(nluManager.search)} />;
};

export default EmptyScreen;
