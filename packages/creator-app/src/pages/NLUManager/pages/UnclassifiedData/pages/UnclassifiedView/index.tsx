import { Table, useOnScreen } from '@voiceflow/ui';
import React from 'react';

import { useNLUManager } from '@/pages/NLUManager/context';

import { LoadingScreen, TableFooter, TableNavbar, TableTopBadge, TableUtteranceRow } from '../../components';
import EmptyScreen from '../../components/EmptyScreen';

const UnclassifiedView: React.OldFC = ({ children }) => {
  const nluManager = useNLUManager();
  const loaderRef = React.useRef<HTMLDivElement>(null);
  const isBottom = useOnScreen(loaderRef);

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

        {!nluManager.isUnclassifiedDataLoading &&
          nluManager.filteredUtterances.map((u, index) => (
            <TableUtteranceRow
              key={u.id}
              onSelect={() => nluManager.toggleSelectedUnclassifiedUtteranceID(u.id)}
              item={u}
              isActive={nluManager.selectedUnclassifiedUtteranceIDs.has(u.id)}
              rowIndex={index}
              allItems={nluManager.filteredUtterances}
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
