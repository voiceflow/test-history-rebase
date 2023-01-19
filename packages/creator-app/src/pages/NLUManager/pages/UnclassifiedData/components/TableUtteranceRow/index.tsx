import * as Realtime from '@voiceflow/realtime-sdk';
import {
  Box,
  Button,
  Checkbox,
  Divider,
  FlexCenter,
  FlexStart,
  getNestedMenuFormattedLabel,
  stopPropagation,
  SvgIcon,
  Text,
  TippyTooltip,
  toast,
} from '@voiceflow/ui';
import React from 'react';

import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks';
import { useNLUManager } from '@/pages/NLUManager/context';
import { copy } from '@/utils/clipboard';

import { formatImportedAt } from '../../utils';
import * as UnclassifiedTable from '../Table';
import { getSimilarityStrength } from './constants';
import * as S from './styles';

interface TableUtteranceRowProps {
  rowIndex: number;
  item: Realtime.NLUUnclassifiedUtterances;
  allItems: Realtime.NLUUnclassifiedUtterances[];
  isActive: boolean;
  onSelect: (utteranceID: string) => void;
  similarity?: number | null;
}

const TableUtteranceRow: React.FC<TableUtteranceRowProps> = ({ rowIndex, item: u, allItems, isActive, similarity, onSelect }) => {
  const nluManager = useNLUManager();
  const [isHovering, setIsHovering] = React.useState(false);
  const importedByUser = useSelector(WorkspaceV2.active.memberByIDSelector, { creatorID: u.sourceID ? parseInt(u.sourceID, 10) : null });

  return (
    <>
      <UnclassifiedTable.Row
        key={u.id}
        active={isActive}
        onClick={() => onSelect(u.id)}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <FlexStart style={{ alignItems: 'flex-start' }}>
          {similarity != null && !isHovering ? (
            <S.SimilarityText color={getSimilarityStrength(similarity)}>{similarity}</S.SimilarityText>
          ) : (
            <Checkbox checked={isActive} onClick={stopPropagation(() => onSelect(u.id))} />
          )}

          <Box ml={12}>
            <S.TextContainer mb={8}>{getNestedMenuFormattedLabel(u.utterance, nluManager.search)}</S.TextContainer>

            <FlexCenter style={{ justifyContent: 'flex-start' }}>
              <Text fontSize={13} color="#62778C">
                {u.importedAt ? formatImportedAt(new Date(u.importedAt)) : 'Unknown'}
              </Text>
              <S.Dot />
              <Text fontSize={13} color="#62778C">
                {importedByUser && (
                  <>
                    Imported by <span style={{ color: 'black' }}>{importedByUser.name}</span>
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
          <S.CopyIconContainer
            onClick={stopPropagation(() => {
              copy(u.utterance);
              toast.success('Copied to clipboard');
            })}
          >
            <TippyTooltip content="Copy" position="top">
              <SvgIcon icon="copy" color={SvgIcon.DEFAULT_COLOR} size={16} clickable />
            </TippyTooltip>
          </S.CopyIconContainer>
          {/* TO DO: create delete behavior */}
          <S.DeleteIconContainer>
            <TippyTooltip content="Delete" position="top">
              <SvgIcon icon="trash" color={SvgIcon.DEFAULT_COLOR} size={16} onClick={stopPropagation(() => {})} clickable />
            </TippyTooltip>
          </S.DeleteIconContainer>
        </UnclassifiedTable.RowButtons>
      </UnclassifiedTable.Row>
      {rowIndex < allItems.length - 1 && <Divider offset={0} isSecondaryColor />}
    </>
  );
};

export default TableUtteranceRow;
