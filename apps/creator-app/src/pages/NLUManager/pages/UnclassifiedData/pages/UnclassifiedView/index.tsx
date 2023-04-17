import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, useConst } from '@voiceflow/ui';
import isEqual from 'lodash/isEqual';
import React from 'react';
import AutoSizer from 'react-virtualized-auto-sizer';
import { FixedSizeList, ListItemKeySelector } from 'react-window';

import { useHotkey } from '@/hooks';
import { Hotkey } from '@/keymap';
import { UNCLASSIFIED_DATA_INTIAL_STATE, useNLUManager } from '@/pages/NLUManager/context';
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

import * as S from './styles';
import VirtualTableUtteranceRow from './VirtualTableUtteranceRow';

const UnclassifiedView: React.FC<React.PropsWithChildren> = () => {
  const nluManager = useNLUManager();

  const selectAllItems = () => {
    nluManager.setSelectedUnclassifiedUtteranceIDs(nluManager.unclassifiedUtterances.map((u) => u.id));
  };

  const itemKey = useConst<ListItemKeySelector<Realtime.NLUUnclassifiedUtterances[]>>((index, data) => data[index].id);

  useHotkey(Hotkey.SELECT_ALL, selectAllItems, { action: 'keydown' });

  if (!nluManager.unclassifiedUtterances.length) return <EmptyScreen />;
  if (!nluManager.filteredUtterances.length && (nluManager.search || !isEqual(UNCLASSIFIED_DATA_INTIAL_STATE, nluManager.unclassifiedDataFilters)))
    return <NoResultScreen />;

  return (
    <S.Container>
      <S.TableContainer>
        {nluManager.isUnclassifiedDataLoading ? (
          <LoadingScreen />
        ) : (
          <>
            <TableTopBadge />

            {nluManager.isFindingSimilar && nluManager.similarCluster?.utteranceIDs.length === 1 && nluManager.activeUnclassifiedUtterance && (
              <TableUtteranceRow
                onSelect={() =>
                  nluManager.activeUnclassifiedUtterance &&
                  nluManager.toggleSelectedUnclassifiedUtteranceID(nluManager.activeUnclassifiedUtterance.id)
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
                utteranceIDs={nluManager.similarCluster.utteranceIDs}
                utteranceCount={nluManager.similarCluster?.utteranceIDs.length}
              />
            )}

            <Box width="100%" height="100%" overflow="auto">
              <AutoSizer>
                {({ width, height }) => (
                  <FixedSizeList
                    ref={nluManager.virtualScrollRef}
                    width={width}
                    height={height}
                    itemKey={itemKey}
                    itemSize={91}
                    itemData={nluManager.filteredUtterances}
                    onScroll={nluManager.handleVirtualScroll}
                    itemCount={nluManager.filteredUtterances.length}
                  >
                    {VirtualTableUtteranceRow}
                  </FixedSizeList>
                )}
              </AutoSizer>
            </Box>
          </>
        )}
      </S.TableContainer>

      {!nluManager.isUnclassifiedDataLoading && (
        <>
          <TableNavbar showFindSimilarButton />

          <TableFooter />
        </>
      )}
    </S.Container>
  );
};

export default UnclassifiedView;
