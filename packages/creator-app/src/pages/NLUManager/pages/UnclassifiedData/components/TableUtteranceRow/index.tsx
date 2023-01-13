import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Button, Checkbox, Divider, FlexCenter, FlexStart, stopPropagation, SvgIcon, Text, toast } from '@voiceflow/ui';
import React from 'react';

import * as NLU from '@/ducks/nlu';
import { copy } from '@/utils/clipboard';

import { formatImportedAt } from '../../utils';
import * as UnclassifiedTable from '../Table';
import * as S from './styles';

interface TableUtteranceRowProps {
  rowIndex: number;
  item: ReturnType<typeof NLU.allUnclassifiedUtterancesSelector>[number];
  allItems: ReturnType<typeof NLU.allUnclassifiedUtterancesSelector> | Realtime.NLUUnclassifiedUtterances[];
  isActive: boolean;
  onSelect: (utteranceID: string) => void;
}

const TableUtteranceRow: React.OldFC<TableUtteranceRowProps> = ({ rowIndex, item: u, allItems, isActive, onSelect }) => {
  return (
    <>
      <UnclassifiedTable.Row key={u.id} active={isActive} onClick={() => onSelect(u.id)}>
        <FlexStart style={{ alignItems: 'flex-start' }}>
          <Checkbox checked={isActive} onClick={stopPropagation(() => onSelect(u.id))} />
          <Box ml={12}>
            <Box mb={8}>{u.utterance}</Box>
            <FlexCenter style={{ justifyContent: 'flex-start' }}>
              <Text fontSize={13} color="#62778C">
                {u.importedAt ? formatImportedAt(new Date(u.importedAt)) : 'Unknown'}
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
        <UnclassifiedTable.RowButtons>
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
        </UnclassifiedTable.RowButtons>
      </UnclassifiedTable.Row>
      {rowIndex < allItems.length - 1 && <Divider offset={0} isSecondaryColor />}
    </>
  );
};

export default TableUtteranceRow;
