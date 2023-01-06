import { FlexCenter, Text } from '@voiceflow/ui';
import React from 'react';

import { useNLUManager } from '@/pages/NLUManager/context';
import { CLUSTER_UTTERANCE_COUNT } from '@/pages/NLUManager/pages/UnclassifiedData/constants';

import * as S from './styles';

interface TableNavbarProps {
  showFindSimilarButton?: boolean;
}

const TableNavbar: React.OldFC<TableNavbarProps> = ({ showFindSimilarButton }) => {
  const nluManager = useNLUManager();
  const selectedUtterances = React.useMemo(() => {
    const clusterUtterancesCount = Array.from(nluManager.selectedClusterIDs).reduce((acc, clusterID) => {
      return acc + CLUSTER_UTTERANCE_COUNT[clusterID];
    }, 0);

    return clusterUtterancesCount + nluManager.selectedUnclassifiedUtteranceIDs.size;
  }, [nluManager.selectedClusterIDs, nluManager.selectedUnclassifiedUtteranceIDs]);

  if (selectedUtterances < 2) return null;

  return (
    <S.TableNavbarContainer>
      <FlexCenter>
        <S.MinusButton onClick={nluManager.resetSelectedUnclassifiedData}>-</S.MinusButton>
        <Text color="#F2F7F7" fontSize={13} opacity="50%">
          {selectedUtterances} utterances selected
        </Text>
      </FlexCenter>

      <S.RightActions>
        <S.IconFooterButton icon="trash" />
        {showFindSimilarButton && <S.SecondaryFooterButton>Find similar</S.SecondaryFooterButton>}
        <S.PrimaryFooterButton squareRadius>Assign to Intent</S.PrimaryFooterButton>
      </S.RightActions>
    </S.TableNavbarContainer>
  );
};

export default TableNavbar;
