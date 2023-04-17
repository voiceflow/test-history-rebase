import { Box, Link, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { dialogflowCXurl } from '@/assets';
import { DIALOGFLOW_CX_LEARN_MORE } from '@/constants/platforms';

const URLExample = (
  <TippyTooltip
    width={282}
    content={
      <TippyTooltip.FooterButton buttonText="More" onClick={() => {}}>
        From your Dialogflow CX console, copy and paste the full agent URL that you want to connect.
        <Box as="img" src={dialogflowCXurl} fullWidth borderRadius={6} mt={12} />
      </TippyTooltip.FooterButton>
    }
    position="bottom"
    interactive
  >
    <Link href={DIALOGFLOW_CX_LEARN_MORE}>See example</Link>
  </TippyTooltip>
);

export default URLExample;
