import { Box, Button, Checkbox, Divider, FlexCenter, FlexStart, stopPropagation, SvgIcon, Table, Text, toast, useOnScreen } from '@voiceflow/ui';
import React from 'react';

import { useNLUManager } from '@/pages/NLUManager/context';
import { copy } from '@/utils/clipboard';

import EmptyScreen from '../../components/EmptyScreen';
import { formatImportedAt } from '../../utils';
import { LoadingScreen, TableOrderDropdown, TableRangeDropdown } from './components';
import * as S from './styles';

const UnclassifiedData: React.FC = () => {
  const {
    unclassifiedUtterances: utterances,
    filteredUtterances,
    selectedUnclassifiedUtteranceIDs,
    toggleSelectedUnclassifiedUtteranceID,
    isScrolling,
    scrollToTop,
    loadMoreUnclassifiedData,
    isUnclassifiedDataLoading,
  } = useNLUManager();
  const loaderRef = React.useRef<HTMLDivElement>(null);
  const isBottom = useOnScreen(loaderRef);

  React.useEffect(() => {
    if (isBottom) {
      loadMoreUnclassifiedData();
    }
  }, [isBottom]);

  if (!utterances.length) return <EmptyScreen />;

  return (
    <div>
      <Table.Container>
        {isScrolling && (
          <S.TopBadge onClick={scrollToTop}>
            <SvgIcon icon="arrowDown" size={14} rotation={180} color="#F2F7F7" />
            <Text fontSize={13} color="#F2F7F7">
              Top
            </Text>
          </S.TopBadge>
        )}

        {isUnclassifiedDataLoading && <LoadingScreen />}

        {!isUnclassifiedDataLoading &&
          filteredUtterances.map((u, index) => {
            return (
              <div key={u.id}>
                <S.UnclassifiedTableRow
                  key={u.utterance}
                  active={selectedUnclassifiedUtteranceIDs.has(u.id)}
                  onClick={() => toggleSelectedUnclassifiedUtteranceID(u.id)}
                >
                  <FlexStart style={{ alignItems: 'flex-start' }}>
                    <Checkbox
                      checked={selectedUnclassifiedUtteranceIDs.has(u.id)}
                      onClick={stopPropagation(() => toggleSelectedUnclassifiedUtteranceID(u.id))}
                    />
                    <Box ml={12}>
                      <Box mb={8}>{u.utterance}</Box>
                      <FlexCenter style={{ justifyContent: 'flex-start' }}>
                        <Text fontSize={13} color="#62778C">
                          {formatImportedAt(u.importedAt)}
                        </Text>
                        <S.Dot />
                        <Text fontSize={13} color="#62778C">
                          {u.importedByUser && (
                            <>
                              Imported by <span style={{ color: 'black' }}>{u.importedByUser}</span>
                            </>
                          )}
                        </Text>
                        <S.Dot />
                        <Text fontSize={13} color="#3D82E2">
                          {u.datasourceName}
                        </Text>
                      </FlexCenter>
                    </Box>
                  </FlexStart>
                  <S.RowButtons>
                    {/* TO DO: add assign to intent select component */}
                    <Button squareRadius onClick={stopPropagation(() => {})}>
                      Assign to Intent
                    </Button>
                    <Box
                      ml={26}
                      mr={24}
                      onClick={stopPropagation(() => {
                        copy(u.utterance);
                        toast.success('Copied to clipboard');
                      })}
                    >
                      <SvgIcon icon="copy" color="#6E849A" size={16} clickable />
                    </Box>
                    {/* TO DO: create delete behavior */}
                    <SvgIcon icon="trash" color="#6E849A" size={16} onClick={stopPropagation(() => {})} />
                  </S.RowButtons>
                </S.UnclassifiedTableRow>
                {index < filteredUtterances.length - 1 && <Divider offset={0} isSecondaryColor />}
              </div>
            );
          })}

        <div ref={loaderRef}></div>
      </Table.Container>

      <S.UnclassifiedFooter position={filteredUtterances.length < 10 ? 'absolute' : 'sticky'}>
        <TableRangeDropdown />
        <TableOrderDropdown />
      </S.UnclassifiedFooter>
    </div>
  );
};

export default UnclassifiedData;
