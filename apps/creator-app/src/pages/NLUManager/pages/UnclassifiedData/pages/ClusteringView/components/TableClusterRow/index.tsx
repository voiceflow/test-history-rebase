import { Box, CheckboxMultiple, Divider, FlexStart, stopPropagation, System, Text } from '@voiceflow/ui';
import { toast } from '@voiceflow/ui-next';
import React from 'react';

import * as NLUDuck from '@/ducks/nlu';
import { useSelector } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';
import { AssignToIntentButton, AssignToIntentDropdown } from '@/pages/NLUManager/components';
import { useNLUManager } from '@/pages/NLUManager/context';
import * as UnclassifiedTable from '@/pages/NLUManager/pages/UnclassifiedData/components/Table';

import * as S from './styles';

interface TableClusterRowProps {
  isLast?: boolean;
  isActive: boolean;
  onSelect: (utteranceID: string) => void;
  utterance: string;
  utteranceIDs: string[];
  utteranceCount: number;
}

const TableClusterRow: React.FC<TableClusterRowProps> = ({ isLast, isActive, onSelect, utterance, utteranceIDs, utteranceCount }) => {
  const nluManager = useNLUManager();
  const [menuOpened, setMenuOpened] = React.useState(false);
  const utterancesByID = useSelector(NLUDuck.unclassifiedUtteranceByIDSelector);
  const manageClusterModal = ModalsV2.useModal(ModalsV2.NLU.Unclassified.ManageClusterData);
  const clusterUtteranceID = utteranceIDs[0];

  const handleDelete = async () => {
    const utterances = utteranceIDs.map((id) => utterancesByID[id]);
    await nluManager.deleteUnclassifiedUtterances(utterances);
    toast.success(`Deleted ${utterances.length} utterances`);
  };

  const handleAssignToIntentButtonClick = (options: { onClick: () => void }) => () => {
    options.onClick();
    nluManager.setOpenedUnclassifiedUtteranceID(clusterUtteranceID);
  };

  const handleAssignToIntentButtonClickOutside = () => {
    if (nluManager.openedUnclassifiedUtteranceID === clusterUtteranceID) {
      nluManager.setOpenedUnclassifiedUtteranceID(null);
      setMenuOpened(false);
    }
  };

  const openClusterModal = () => {
    manageClusterModal.openVoid({ utteranceIDs });
  };

  return (
    <>
      <UnclassifiedTable.Row key={utterance} active={isActive} onClick={() => onSelect(utterance)}>
        <FlexStart style={{ alignItems: 'flex-start' }}>
          <Box>
            <CheckboxMultiple checked={isActive} onClick={stopPropagation(() => onSelect(utterance))} color={isActive ? '#3d82e2' : '#8da2b6'} />
          </Box>

          <Box ml={12}>
            <Box display="flex" alignItems="center" mt={-4} mb={6}>
              {utterance}

              <S.ClusterCountBox onClick={stopPropagation(openClusterModal)}>
                <Text color="#62778C" fontSize={13} fontWeight={600}>
                  +{utteranceCount}
                </Text>
              </S.ClusterCountBox>
            </Box>

            <Box fontSize={13}>
              <System.Link.Button onClick={stopPropagation(openClusterModal)}>View and manage cluster data</System.Link.Button>
            </Box>
          </Box>
        </FlexStart>

        <UnclassifiedTable.RowButtons hovered={nluManager.openedUnclassifiedUtteranceID === clusterUtteranceID}>
          <AssignToIntentDropdown
            utteranceIDs={utteranceIDs}
            onClickOutside={handleAssignToIntentButtonClickOutside}
            renderTrigger={({ onClick = () => {}, isOpen, onHideMenu }) => (
              <AssignToIntentButton
                onClick={handleAssignToIntentButtonClick({ onClick })}
                onHideMenu={onHideMenu}
                menuOpened={menuOpened}
                setMenuOpened={setMenuOpened}
                isOpen={isOpen}
              />
            )}
          />

          <System.IconButtonsGroup.Base ml={18}>
            <System.IconButton.Base icon="copy" onClick={stopPropagation()} activeBackground={false} hoverBackground={false} />
            <System.IconButton.Base icon="trash" onClick={stopPropagation(handleDelete)} activeBackground={false} hoverBackground={false} />
          </System.IconButtonsGroup.Base>
        </UnclassifiedTable.RowButtons>
      </UnclassifiedTable.Row>

      {!isLast && <Divider offset={0} isSecondaryColor />}
    </>
  );
};

export default TableClusterRow;
