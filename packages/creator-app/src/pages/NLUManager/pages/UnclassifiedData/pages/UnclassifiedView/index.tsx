import { Table, useOnScreen } from '@voiceflow/ui';
import React from 'react';

import { useHotKeys } from '@/hooks';
import { Hotkey } from '@/keymap';
import { useNLUManager } from '@/pages/NLUManager/context';
import TableClusterRow from '@/pages/NLUManager/pages/UnclassifiedData/pages/ClusteringView/components/TableClusterRow';

import { LoadingScreen, TableFooter, TableNavbar, TableTopBadge, TableUtteranceRow } from '../../components';
import EmptyScreen from '../../components/EmptyScreen';

const UnclassifiedView: React.OldFC = ({ children }) => {
  const nluManager = useNLUManager();
  const loaderRef = React.useRef<HTMLDivElement>(null);
  const isBottom = useOnScreen(loaderRef);

  const selectAllItems = () => {
    nluManager.setSelectedUnclassifiedUtteranceIDs(nluManager.unclassifiedUtterances.map((u) => u.id));
  };

  useHotKeys(Hotkey.SELECT_ALL, selectAllItems, { action: 'keydown' });

  React.useEffect(() => {
    if (isBottom) {
      nluManager.loadMoreUnclassifiedData();
    }
  }, [isBottom]);

  if (!nluManager.unclassifiedUtterances.length) return <EmptyScreen />;

  return (
    <div>
      <Table.Container>
        <TableTopBadge />

        {nluManager.isUnclassifiedDataLoading && <LoadingScreen />}

        {nluManager.isFindingSimilar && nluManager.similarCluster?.utteranceIDs.length === 1 && nluManager.activeUnclassifiedUtterance && (
          <TableUtteranceRow
            onSelect={() =>
              nluManager.activeUnclassifiedUtterance && nluManager.toggleSelectedUnclassifiedUtteranceID(nluManager.activeUnclassifiedUtterance.id)
            }
            item={nluManager.activeUnclassifiedUtterance}
            isActive
            rowIndex={0}
            allItems={nluManager.filteredUtterances}
          />
        )}

        {nluManager.isFindingSimilar && !!nluManager.similarCluster?.utteranceIDs.length && (
          <TableClusterRow
            isActive
            onSelect={() => nluManager.toggleSelectedUnclassifiedUtteranceID(null)}
            utterance={nluManager.activeUnclassifiedUtterance?.utterance || ''}
            utteranceCount={nluManager.similarCluster?.utteranceIDs.length}
          />
        )}

        {!nluManager.isUnclassifiedDataLoading &&
          nluManager.filteredUtterances.map((u: any, index) => (
            <TableUtteranceRow
              key={u.id}
              onSelect={() => nluManager.toggleSelectedUnclassifiedUtteranceID(u.id)}
              item={u}
              isActive={nluManager.selectedUnclassifiedUtteranceIDs.has(u.id)}
              rowIndex={index}
              allItems={nluManager.filteredUtterances}
              similarity={nluManager.similarityScores && nluManager.similarityScores[u.id]}
            />
          ))}

        {children}
      </Table.Container>

      <TableNavbar showFindSimilarButton />

      <TableFooter />
    </div>
  );
};

export default UnclassifiedView;
