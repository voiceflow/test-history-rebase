import { Box, Button, ButtonVariant, FlexCenter, Link, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import * as ModalsV2 from '@/ModalsV2';

const EmptyScreen: React.FC = () => {
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
          No unclassified data exist
        </Box>
      </FlexCenter>

      <FlexCenter>
        <Box mt={8} mb={16} textAlign="center" color="#62778c" maxWidth={250}>
          Unclassified user response data from tests, prototyes or the live assistant allows you to fill gaps in your model.{' '}
          <Link onClick={onLearnMore}>Learn more</Link>
        </Box>
      </FlexCenter>

      <FlexCenter>
        <Button variant={ButtonVariant.PRIMARY} onClick={onCreate}>
          Import Data
        </Button>
      </FlexCenter>
    </FlexCenter>
  );
};

export default EmptyScreen;
