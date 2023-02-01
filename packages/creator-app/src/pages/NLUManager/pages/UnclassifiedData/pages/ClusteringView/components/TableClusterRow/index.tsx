import { Box, CheckboxMultiple, Divider, FlexStart, Link, stopPropagation, SvgIcon, Text, toast } from '@voiceflow/ui';
import React from 'react';

import * as NLUDuck from '@/ducks/nlu';
import { useSelector } from '@/hooks';
import * as ModalsV2 from '@/ModalsV2';
import { AssignToIntentButton, AssignToIntentDropdown } from '@/pages/NLUManager/components';
import { useNLUManager } from '@/pages/NLUManager/context';
import * as UnclassifiedTable from '@/pages/NLUManager/pages/UnclassifiedData/components/Table';

import * as S from './styles';

interface TableClusterRowProps {
  utterance: string;
  utteranceIDs: string[];
  utteranceCount: number;
  isActive: boolean;
  onSelect: (utteranceID: string) => void;
}

const TableClusterRow: React.OldFC<TableClusterRowProps> = ({ utterance, utteranceIDs, utteranceCount, isActive, onSelect }) => {
  const nluManager = useNLUManager();
  const [menuOpened, setMenuOpened] = React.useState(false);
  const utterancesByID = useSelector(NLUDuck.utterancesByID);
  const manageClusterModal = ModalsV2.useModal(ModalsV2.NLU.Unclassified.ManageClusterData);

  const handleDelete = async () => {
    const utterances = utteranceIDs.map((id) => utterancesByID[id]);
    await nluManager.deleteUnclassifiedUtterances(utterances);
    toast.success(`Deleted ${utterances.length} utterances`);
  };

  const openClusterModal = () => {
    manageClusterModal.openVoid({ utteranceIDs });
  };

  return (
    <>
      <UnclassifiedTable.Row key={utterance} active={isActive} onClick={() => onSelect(utterance)} onMouseLeave={() => setMenuOpened(false)}>
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
            <Box fontSize={13}>
              <Link onClick={stopPropagation(openClusterModal)}>View and manage cluster data</Link>
            </Box>
          </Box>
        </FlexStart>
        <UnclassifiedTable.RowButtons>
          <AssignToIntentDropdown
            utteranceIDs={utteranceIDs}
            renderTrigger={({ onClick, isOpen, onHideMenu }) => (
              <AssignToIntentButton onClick={onClick} onHideMenu={onHideMenu} menuOpened={menuOpened} setMenuOpened={setMenuOpened} isOpen={isOpen} />
            )}
          />
          <Box ml={26} mr={24} onClick={stopPropagation(() => {})}>
            <SvgIcon icon="copy" color="#6E849A" size={16} clickable />
          </Box>
          <SvgIcon icon="trash" color="#6E849A" size={16} onClick={stopPropagation(handleDelete)} clickable />
        </UnclassifiedTable.RowButtons>
      </UnclassifiedTable.Row>
      <Divider offset={0} isSecondaryColor />
    </>
  );
};

export default TableClusterRow;
