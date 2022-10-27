import { Box, Button, Checkbox, Divider, FlexCenter, FlexStart, stopPropagation, SvgIcon, Table, Text, toast } from '@voiceflow/ui';
import React from 'react';

import { useNLUManager } from '@/pages/NLUManager/context';
import { useTableHotkeys } from '@/pages/NLUManager/hooks';
import { copy } from '@/utils/clipboard';

import EmptyScreen from './components/EmptyScreen';
import * as S from './styles';
import { formatImportedAt, formatImportedAtDate } from './utils';

const UnclassifiedData: React.FC = () => {
  const {
    unclassifiedUtterances: utterances,
    toggleActiveItemID,
    activeItemID,
    selectedUnclassifiedUtteranceIDs,
    toggleSelectedUnclassifiedUtteranceID,
  } = useNLUManager();

  useTableHotkeys(utterances);

  if (!utterances.length) return <EmptyScreen />;

  return (
    <Table.Container>
      {utterances.map((u, index) => {
        return (
          <div key={u.id}>
            <Table.Row
              key={u.utterance}
              style={{ height: '88px', display: 'flex', justifyContent: 'space-between' }}
              onClick={() => toggleActiveItemID(u.id)}
              active={activeItemID === u.id}
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
                      {formatImportedAtDate(u.importedAt)}
                    </Text>
                  </FlexCenter>
                </Box>
              </FlexStart>
              <FlexCenter style={{ visibility: activeItemID === u.id ? 'visible' : 'hidden' }}>
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
              </FlexCenter>
            </Table.Row>
            <Divider offset={0} isSecondaryColor={index !== utterances.length - 1} />
          </div>
        );
      })}
    </Table.Container>
  );
};

export default UnclassifiedData;
