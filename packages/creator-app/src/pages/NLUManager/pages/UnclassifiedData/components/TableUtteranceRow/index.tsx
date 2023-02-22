import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Checkbox, Divider, getNestedMenuFormattedLabel, stopPropagation, System, Text, TippyTooltip, toast } from '@voiceflow/ui';
import React from 'react';

import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks';
import { AssignToIntentButton, AssignToIntentDropdown } from '@/pages/NLUManager/components';
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
  const [menuOpened, setMenuOpened] = React.useState(false);
  const rowRef = React.useRef<HTMLDivElement>(null);

  const handleDelete = async () => {
    await nluManager.deleteUnclassifiedUtterances([u]);
    toast.success('Utterance deleted');
  };

  return (
    <>
      <UnclassifiedTable.Row
        key={u.id}
        active={isActive}
        ref={rowRef}
        onClick={() => onSelect(u.id)}
        hoverDisabled={!!nluManager.openedUnclassifiedUtteranceID && nluManager.openedUnclassifiedUtteranceID !== u.id}
        hovered={!!nluManager.openedUnclassifiedUtteranceID && nluManager.openedUnclassifiedUtteranceID === u.id}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <Box.FlexStart alignItems="flex-start" gap={12}>
          {similarity != null && !isHovering ? (
            <S.SimilarityText color={getSimilarityStrength(similarity)}>{similarity}</S.SimilarityText>
          ) : (
            <Box>
              <Checkbox checked={isActive} onClick={stopPropagation(() => onSelect(u.id))} />
            </Box>
          )}

          <Box>
            <S.TextContainer mb={8}>{getNestedMenuFormattedLabel(u.utterance, nluManager.search)}</S.TextContainer>

            <Box.FlexStart>
              <S.RowDetailsText>{u.importedAt ? formatImportedAt(new Date(u.importedAt)) : 'Unknown'}</S.RowDetailsText>
              <S.Dot />
              <S.RowDetailsText>
                {importedByUser && (
                  <>
                    Imported by <span style={{ color: 'black' }}>{importedByUser.name}</span>
                  </>
                )}
              </S.RowDetailsText>
              <S.Dot />
              <Text fontSize={13} color="#3D82E2">
                {u.datasourceName}
              </Text>
            </Box.FlexStart>
          </Box>
        </Box.FlexStart>
        <UnclassifiedTable.RowButtons hovered={nluManager.openedUnclassifiedUtteranceID === u.id}>
          <AssignToIntentDropdown
            utteranceIDs={[u.id]}
            onClickOutside={() => {
              if (nluManager.openedUnclassifiedUtteranceID === u.id) {
                nluManager.setOpenedUnclassifiedUtteranceID(null);
                setMenuOpened(false);
              }
            }}
            renderTrigger={({ onClick = () => {}, isOpen, onHideMenu = () => {} }) => (
              <AssignToIntentButton
                onClick={() => {
                  onClick();

                  if (nluManager.openedUnclassifiedUtteranceID === u.id) {
                    onHideMenu();
                    nluManager.setOpenedUnclassifiedUtteranceID(null);
                    setMenuOpened(false);
                    return;
                  }

                  nluManager.setOpenedUnclassifiedUtteranceID(u.id);
                }}
                onHideMenu={onHideMenu}
                menuOpened={menuOpened}
                setMenuOpened={setMenuOpened}
                isOpen={isOpen}
              />
            )}
          />
          <System.IconButtonsGroup.Base gap={4} ml={16}>
            <TippyTooltip content="Copy" position="top">
              <System.IconButton.Base
                onClick={stopPropagation(() => {
                  copy(u.utterance);
                  toast.success('Copied to clipboard');
                })}
                icon="copy"
                hoverBackground={false}
                activeBackground={false}
              />
            </TippyTooltip>

            <TippyTooltip content="Delete" position="top">
              <System.IconButton.Base icon="trash" onClick={stopPropagation(handleDelete)} hoverBackground={false} activeBackground={false} />
            </TippyTooltip>
          </System.IconButtonsGroup.Base>
        </UnclassifiedTable.RowButtons>
      </UnclassifiedTable.Row>
      {(rowIndex < allItems.length - 1 || rowIndex < 8) && <Divider offset={0} isSecondaryColor />}
    </>
  );
};

export default TableUtteranceRow;
