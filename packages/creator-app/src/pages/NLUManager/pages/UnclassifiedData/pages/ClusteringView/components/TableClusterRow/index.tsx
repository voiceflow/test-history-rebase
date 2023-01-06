import { Box, Button, CheckboxMultiple, Divider, FlexStart, stopPropagation, SvgIcon, Text } from '@voiceflow/ui';
import React from 'react';

import * as UnclassifiedTable from '@/pages/NLUManager/pages/UnclassifiedData/components/Table';

import * as S from './styles';

interface TableClusterRowProps {
  utterance: string;
  utteranceCount: number;
  isActive: boolean;
  onSelect: (utteranceID: string) => void;
}

const TableClusterRow: React.OldFC<TableClusterRowProps> = ({ utterance, utteranceCount, isActive, onSelect }) => {
  return (
    <>
      <UnclassifiedTable.Row key={utterance} active={isActive} onClick={() => onSelect(utterance)}>
        <FlexStart style={{ alignItems: 'flex-start' }}>
          <Box mr={12}>
            <CheckboxMultiple checked={isActive} onClick={stopPropagation(() => onSelect(utterance))} />
          </Box>
          <Box ml={12}>
            <Box display="flex" alignItems="center">
              {utterance}
              <S.ClusterCountBox>
                <Text color="#62778C" fontSize={13} fontWeight={600}>
                  +{utteranceCount}
                </Text>
              </S.ClusterCountBox>
            </Box>
            <Box>
              <Text fontSize={13} color="#3D82E2">
                View and manage cluster data
              </Text>
            </Box>
          </Box>
        </FlexStart>
        <UnclassifiedTable.RowButtons>
          {/* TO DO: add assign to intent select component */}
          <Button squareRadius onClick={stopPropagation(() => {})}>
            Assign to Intent
          </Button>
          <Box ml={26} mr={24} onClick={stopPropagation(() => {})}>
            <SvgIcon icon="copy" color="#6E849A" size={16} clickable />
          </Box>
          {/* TO DO: create delete behavior */}
          <SvgIcon icon="trash" color="#6E849A" size={16} onClick={stopPropagation(() => {})} />
        </UnclassifiedTable.RowButtons>
      </UnclassifiedTable.Row>
      <Divider offset={0} isSecondaryColor />
    </>
  );
};

export default TableClusterRow;
