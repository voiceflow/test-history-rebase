import { Box, Button, ButtonVariant, FlexCenter, Link, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import * as ModalsV2 from '@/ModalsV2';
import { UnclassifiedTabs } from '@/pages/NLUManager/constants';
import { useNLUManager } from '@/pages/NLUManager/context';

import * as S from './styles';

const EmptyScreen: React.FC = () => {
  const { open } = ModalsV2.useModal(ModalsV2.NLU.Import);
  const nluManager = useNLUManager();

  // TODO: [Unclassified] add learn more link
  const onLearnMore = () => {};

  const onCreate = () => open({ importType: ModalsV2.NLU.ImportType.UNCLASSIFIED });

  const handleBackToAllData = () => nluManager.changeUnclassifiedPageTab(UnclassifiedTabs.UNCLASSIFIED_VIEW);

  return (
    <S.Container>
      <FlexCenter>
        <SvgIcon size={80} icon="fail" />
      </FlexCenter>

      <FlexCenter>
        <Box mt={16} fontWeight={600}>
          Insufficient data to cluster
        </Box>
      </FlexCenter>

      <FlexCenter>
        <Box mt={8} mb={16} textAlign="center" color="#62778c" maxWidth={300}>
          Unable to cluster utterances as there&apos;s not enough unclassified data. <Link onClick={onLearnMore}>Learn more</Link>
        </Box>
      </FlexCenter>

      <S.ButtonsContainer>
        <Button squareRadius variant={ButtonVariant.QUATERNARY} onClick={handleBackToAllData}>
          Back to All Data
        </Button>

        <Button squareRadius variant={ButtonVariant.PRIMARY} onClick={onCreate}>
          Import Data
        </Button>
      </S.ButtonsContainer>
    </S.Container>
  );
};

export default EmptyScreen;
