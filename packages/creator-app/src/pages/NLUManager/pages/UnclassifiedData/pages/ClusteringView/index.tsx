import * as Realtime from '@voiceflow/realtime-sdk';
import { Table } from '@voiceflow/ui';
import React from 'react';

import { useFeature, useHotKeys } from '@/hooks';
import { Hotkey } from '@/keymap';
import { useNLUManager } from '@/pages/NLUManager/context';

import { LoadingScreen, NoResultScreen, TableFooter, TableNavbar, TableTopBadge } from '../../components';
import { EmptyScreen, TableClusterRow } from './components';

const ClusteringView: React.FC<React.PropsWithChildren> = ({ children }) => {
  const nluManager = useNLUManager();
  const { isEnabled: isClusteringViewEnabled } = useFeature(Realtime.FeatureFlag.NLU_MANAGER_CLUSTERING_VIEW);

  const selectAllItems = () => {
    nluManager.setSelectedClusterIDs(new Set(nluManager.unclassifiedDataClusters.map((c) => c.id)));
  };

  useHotKeys(Hotkey.SELECT_ALL, selectAllItems, { action: 'keyup' });

  if (!nluManager.filteredUtterances.length && nluManager.search) return <NoResultScreen />;
  if (!nluManager.unclassifiedUtterances.length || !nluManager.unclassifiedDataClusters.length || !isClusteringViewEnabled) return <EmptyScreen />;

  return (
    <div>
      <Table.Container style={{ height: '100vh' }}>
        <TableTopBadge />

        {nluManager.isUnclassifiedDataLoading && <LoadingScreen />}

        {!nluManager.isUnclassifiedDataLoading &&
          nluManager.unclassifiedDataClusters.map((cluster) => (
            <TableClusterRow
              key={cluster.id}
              utterance={cluster.name}
              utteranceIDs={cluster.utteranceIDs}
              utteranceCount={cluster.utteranceIDs.length}
              isActive={nluManager.selectedClusterIDs.has(cluster.id)}
              onSelect={() => nluManager.toggleClusterSelection(cluster.id)}
            />
          ))}

        {children}
      </Table.Container>

      <TableNavbar />

      <TableFooter />
    </div>
  );
};

export default ClusteringView;
