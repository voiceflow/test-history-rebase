import { Box, Link, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { dialogflowCXurl } from '@/assets';

const URLExample = (
  <TippyTooltip
    html={
      <TippyTooltip.FooterButton buttonText="More" onClick={() => {}} width={350}>
        From your Dialogflow CX console, copy and paste the full agent URL that you want to connect.
        <Box as="img" src={dialogflowCXurl} fullWidth borderRadius={6} mt={12} />
      </TippyTooltip.FooterButton>
    }
    position="bottom"
    interactive
    bodyOverflow
  >
    <Link>See example</Link>
  </TippyTooltip>
);

export default URLExample;
