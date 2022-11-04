import React from 'react';

import { useNLUManager } from '@/pages/NLUManager/context';

import { UnclassifiedTabs } from '../../constants';
import EmptyScreen from './components/EmptyScreen';
import Cluster from './pages/Cluster';
import ListAll from './pages/ListAll';

const UnclassifiedData: React.FC = () => {
  const { selectedUnclassifiedTab, unclassifiedUtterances } = useNLUManager();

  if (!unclassifiedUtterances.length) return <EmptyScreen />;
  if (selectedUnclassifiedTab === UnclassifiedTabs.LIST_ALL) return <ListAll />;

  return <Cluster />;
};

export default UnclassifiedData;
