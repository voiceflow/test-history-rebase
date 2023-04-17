import * as Realtime from '@voiceflow/realtime-sdk';
import { Box } from '@voiceflow/ui';
import React from 'react';

import { useFeature, useHotkey } from '@/hooks';
import { Hotkey } from '@/keymap';
import { useNLUManager } from '@/pages/NLUManager/context';

import { LoadingScreen, NoResultScreen, TableFooter, TableNavbar, TableTopBadge } from '../../components';
import { EmptyScreen, TableClusterRow } from './components';
import * as S from './styles';

const ClusteringView: React.FC<React.PropsWithChildren> = ({ children }) => {
  const nluManager = useNLUManager();
  const { isEnabled: isClusteringViewEnabled } = useFeature(Realtime.FeatureFlag.NLU_MANAGER_CLUSTERING_VIEW);

  const selectAllItems = () => {
    nluManager.setSelectedClusterIDs(new Set(nluManager.unclassifiedDataClusters.map((c) => c.id)));
  };

  useHotkey(Hotkey.SELECT_ALL, selectAllItems, { action: 'keyup' });

  if (!nluManager.filteredUtterances.length && nluManager.search) return <NoResultScreen />;
  if (
    !nluManager.unclassifiedUtterances.length ||
    (!nluManager.unclassifiedDataClusters.length && !nluManager.isUnclassifiedDataLoading) ||
    !isClusteringViewEnabled
  )
    return <EmptyScreen />;

  return (
    <S.Container>
      <S.TableContainer>
        <Box ref={nluManager.tableRef} width="100%" height="100%" overflow="auto" onScroll={nluManager.handleScroll}>
          <TableTopBadge />

          {nluManager.isUnclassifiedDataLoading ? (
            <LoadingScreen />
          ) : (
            nluManager.unclassifiedDataClusters.map((cluster, index) => (
              <TableClusterRow
                key={cluster.id}
                isLast={index === nluManager.unclassifiedDataClusters.length - 1}
                isActive={nluManager.selectedClusterIDs.has(cluster.id)}
                onSelect={() => nluManager.toggleClusterSelection(cluster.id)}
                utterance={cluster.name}
                utteranceIDs={cluster.utteranceIDs}
                utteranceCount={cluster.utteranceIDs.length}
              />
            ))
          )}
        </Box>

        {children}
      </S.TableContainer>

      {!nluManager.isUnclassifiedDataLoading && (
        <>
          <TableNavbar />

          <TableFooter />
        </>
      )}
    </S.Container>
  );
};

export default ClusteringView;
