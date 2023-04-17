import React from 'react';

import * as ModalsV2 from '@/ModalsV2';
import EmptyView from '@/pages/NLUManager/components/EmptyView';
import NoResultsScreen from '@/pages/NLUManager/components/NoResultsScreen';
import { useNLUManager } from '@/pages/NLUManager/context';

const EmptyScreen: React.FC = () => {
  const nluManager = useNLUManager();
  const nluImportIntentsModal = ModalsV2.useModal(ModalsV2.NLU.Import);

  if (nluManager.search) {
    return <NoResultsScreen itemName="intents" onCleanFilters={() => nluManager.setSearch('')} />;
  }

  return <EmptyView tab={nluManager.activeTab} onCreate={() => nluImportIntentsModal.openVoid({ importType: ModalsV2.NLU.ImportType.INTENT })} />;
};

export default EmptyScreen;
