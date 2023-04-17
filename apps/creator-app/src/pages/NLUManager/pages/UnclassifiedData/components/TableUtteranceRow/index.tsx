import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, Divider, getNestedMenuFormattedLabel, stopPropagation, System, Text, TippyTooltip, toast } from '@voiceflow/ui';
import React from 'react';

import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';
import { AssignToIntentButton, AssignToIntentDropdown } from '@/pages/NLUManager/components';
import { useNLUManager } from '@/pages/NLUManager/context';
import { copy } from '@/utils/clipboard';

import { formatImportedAt } from '../../utils';
import * as UnclassifiedTable from '../Table';
import { getSimilarityStrength } from './constants';
import * as S from './styles';

interface TableUtteranceRowProps {
  item: Realtime.NLUUnclassifiedUtterances;
  rowIndex: number;
  allItems: Realtime.NLUUnclassifiedUtterances[];
  isActive: boolean;
  onSelect: (utteranceID: string) => void;
  similarity?: number | null;
}

const TableUtteranceRow: React.FC<TableUtteranceRowProps> = ({ rowIndex, item: u, allItems, isActive, onSelect, similarity }) => {
  const nluManager = useNLUManager();
  const importedByUser = useSelector(WorkspaceV2.active.memberByIDSelector, { creatorID: u.sourceID ? parseInt(u.sourceID, 10) : null });
  const [menuOpened, setMenuOpened] = React.useState(false);
  const rowRef = React.useRef<HTMLDivElement>(null);
  const manageClusterModal = ModalsV2.useModal(ModalsV2.NLU.Unclassified.ManageClusterData);

  const handleDelete = async () => {
    await nluManager.deleteUnclassifiedUtterances([u]);
    toast.success('Utterance deleted');
  };

  const handleOpenDatasourceModal = () => {
    const utteranceIDs = nluManager.unclassifiedUtterances.filter((utterance) => utterance.datasourceID === u.datasourceID).map((u) => u.id);
    manageClusterModal.openVoid({ title: u.datasourceName, utteranceIDs });
  };

  const handleAssignToIntentButtonClick = (options: { onClick: () => void; onHideMenu: () => void }) => () => {
    if (nluManager.isFindingSimilar) {
      onSelect(u.id);
      toast.success('Added to cluster');
      return;
    }

    options.onClick();

    if (nluManager.openedUnclassifiedUtteranceID === u.id) {
      options.onHideMenu();
      nluManager.setOpenedUnclassifiedUtteranceID(null);
      setMenuOpened(false);
      return;
    }

    nluManager.setOpenedUnclassifiedUtteranceID(u.id);
  };

  const handleAssignToIntentButtonClickOutside = () => {
    if (nluManager.openedUnclassifiedUtteranceID === u.id) {
      nluManager.setOpenedUnclassifiedUtteranceID(null);
      setMenuOpened(false);
    }
  };

  if (nluManager.similarCluster?.utteranceIDs.includes(u.id) || Object.keys(nluManager.clusteredUtterances).includes(u.id)) return null;

  return (
    <>
      <UnclassifiedTable.Row
        key={u.id}
        ref={rowRef}
        active={isActive}
        onClick={() => onSelect(u.id)}
        hovered={!!nluManager.openedUnclassifiedUtteranceID && nluManager.openedUnclassifiedUtteranceID === u.id}
        hoverDisabled={!!nluManager.openedUnclassifiedUtteranceID && nluManager.openedUnclassifiedUtteranceID !== u.id}
      >
        <Box.FlexStart alignItems="flex-start" gap={25} overflow="hidden">
          {similarity != null ? (
            <S.SimilarityText color={getSimilarityStrength(similarity)}>{similarity}</S.SimilarityText>
          ) : (
            <Box>
              <S.UtteranceRowCheckbox checked={isActive} onClick={stopPropagation(() => onSelect(u.id))} padding={false} />
            </Box>
          )}

          <Box overflow="hidden">
            <S.TextContainer mb={8}>{getNestedMenuFormattedLabel(u.utterance, nluManager.search)}</S.TextContainer>

            <Box.FlexStart>
              <S.RowDetailsText>{u.importedAt ? formatImportedAt(new Date(u.importedAt)) : 'Unknown'}</S.RowDetailsText>
              <S.Dot />

              {importedByUser && (
                <>
                  <S.RowDetailsText>
                    Imported by <Text color="#132144">{importedByUser.name}</Text>
                  </S.RowDetailsText>

                  <S.Dot />
                </>
              )}

              <System.Link.Button fontSize="13px" onClick={stopPropagation(handleOpenDatasourceModal)}>
                {u.datasourceName}
              </System.Link.Button>
            </Box.FlexStart>
          </Box>
        </Box.FlexStart>

        <UnclassifiedTable.RowButtons hovered={nluManager.openedUnclassifiedUtteranceID === u.id}>
          <AssignToIntentDropdown
            utteranceIDs={[u.id]}
            onClickOutside={handleAssignToIntentButtonClickOutside}
            renderTrigger={({ onClick = () => {}, isOpen, onHideMenu = () => {} }) => (
              <AssignToIntentButton
                onClick={handleAssignToIntentButtonClick({ onClick, onHideMenu })}
                onHideMenu={onHideMenu}
                menuOpened={menuOpened}
                setMenuOpened={setMenuOpened}
                isOpen={isOpen}
              >
                {nluManager.isFindingSimilar ? 'Add to cluster' : 'Assign to intent'}
              </AssignToIntentButton>
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

      {(rowIndex < allItems.length - 1 || rowIndex < 8) && allItems.length > 1 && <Divider offset={0} isSecondaryColor />}
    </>
  );
};

export default TableUtteranceRow;
