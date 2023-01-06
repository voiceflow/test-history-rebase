import { Box, Button, ButtonVariant, FlexCenter, Link, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import * as ModalsV2 from '@/ModalsV2';

const EmptyScreen: React.OldFC = () => {
  const { open } = ModalsV2.useModal(ModalsV2.NLU.Import);
  // to do implement actions behaviors
  const onLearnMore = () => {};
  const onCreate = () => open({ importType: ModalsV2.NLU.ImportType.UNCLASSIFIED });

  return (
    <FlexCenter style={{ width: '100%', flexDirection: 'column', height: '100%' }}>
      <FlexCenter>
        <SvgIcon size={80} icon="noContent" />
      </FlexCenter>

      <FlexCenter>
        <Box mt={16} fontWeight={600}>
          Insuficient data to cluster
        </Box>
      </FlexCenter>

      <FlexCenter>
        <Box mt={8} mb={16} textAlign="center" color="#62778c" maxWidth={250}>
          We were unable to cluster utterances as there&apos;s not enough unclassified data. <Link onClick={onLearnMore}>Learn more</Link>
        </Box>
      </FlexCenter>

      <FlexCenter>
        <Button squareRadius variant={ButtonVariant.PRIMARY} onClick={onCreate}>
          Import Data
        </Button>
      </FlexCenter>
    </FlexCenter>
  );
};

export default EmptyScreen;
