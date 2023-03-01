import { Table, useOnScreen } from '@voiceflow/ui';
import React from 'react';

import { useHotkey } from '@/hooks';
import { Hotkey } from '@/keymap';
import { useNLUManager } from '@/pages/NLUManager/context';
import {
  EmptyScreen,
  LoadingScreen,
  NoResultScreen,
  TableFooter,
  TableNavbar,
  TableTopBadge,
  TableUtteranceRow,
} from '@/pages/NLUManager/pages/UnclassifiedData/components';
import TableClusterRow from '@/pages/NLUManager/pages/UnclassifiedData/pages/ClusteringView/components/TableClusterRow';

const UnclassifiedView: React.FC<React.PropsWithChildren> = ({ children }) => {
  const nluManager = useNLUManager();
  const loaderRef = React.useRef<HTMLDivElement>(null);
  const isBottom = useOnScreen(loaderRef);

  const selectAllItems = () => {
    nluManager.setSelectedUnclassifiedUtteranceIDs(nluManager.unclassifiedUtterances.map((u) => u.id));
  };

  useHotkey(Hotkey.SELECT_ALL, selectAllItems, { action: 'keydown' });

  React.useEffect(() => {
    if (isBottom) {
      nluManager.loadMoreUnclassifiedData();
    }
  }, [isBottom]);

  if (!nluManager.unclassifiedUtterances.length) return <EmptyScreen />;
  if (!nluManager.filteredUtterances.length && nluManager.search) return <NoResultScreen />;

  const isPageLoading = nluManager.isUnclassifiedDataLoading;

  return (
    <div>
      <Table.Container>
        <TableTopBadge />

        {isPageLoading && <LoadingScreen />}

        {!isPageLoading &&
          nluManager.isFindingSimilar &&
          nluManager.similarCluster?.utteranceIDs.length === 1 &&
          nluManager.activeUnclassifiedUtterance && (
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

        {!isPageLoading && nluManager.isFindingSimilar && !!nluManager.similarCluster?.utteranceIDs.length && (
          <TableClusterRow
            isActive
            utteranceIDs={nluManager.similarCluster.utteranceIDs}
            onSelect={() => nluManager.toggleSelectedUnclassifiedUtteranceID(null)}
            utterance={nluManager.activeUnclassifiedUtterance?.utterance || ''}
            utteranceCount={nluManager.similarCluster?.utteranceIDs.length}
          />
        )}

        {!isPageLoading &&
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
