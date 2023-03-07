import { Box, Button, ButtonVariant, FlexCenter, SvgIcon, System } from '@voiceflow/ui';
import React from 'react';

import { NLU_MANAGER_ARTICLE_LINK } from '@/constants/links';
import * as ModalsV2 from '@/ModalsV2';

import * as S from './styles';

const EmptyScreen: React.FC = () => {
  const nluImport = ModalsV2.useModal(ModalsV2.NLU.Import);

  const onCreate = () => nluImport.open({ importType: ModalsV2.NLU.ImportType.UNCLASSIFIED });

  return (
    <S.Container>
      <FlexCenter>
        <SvgIcon size={80} icon="noContent" />
      </FlexCenter>

      <FlexCenter>
        <Box mt={16} fontWeight={600}>
          No unclassified data exist
        </Box>
      </FlexCenter>

      <FlexCenter>
        <Box mt={8} mb={16} textAlign="center" color="#62778c" maxWidth={250}>
          Unclassified user response data from tests, prototypes or the live assistant allows you to fill gaps in your model.{' '}
          <System.Link.Anchor href={NLU_MANAGER_ARTICLE_LINK}>Learn more</System.Link.Anchor>
        </Box>
      </FlexCenter>

      <FlexCenter>
        <Button variant={ButtonVariant.PRIMARY} onClick={onCreate}>
          Import Data
        </Button>
      </FlexCenter>
    </S.Container>
  );
};

export default EmptyScreen;
