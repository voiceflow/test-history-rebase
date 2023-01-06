import { Box, PageError } from '@voiceflow/ui';
import React from 'react';

import { mobile } from '@/assets';

const ScreenSizeWarning: React.OldFC = () => (
  <Box backgroundColor="#fafafa">
    <PageError
      icon={<img src={mobile} alt="" width={80} />}
      title="Mobile not yet supported"
      message="Voiceflow doesn’t support mobile. Please transfer to desktop."
    ></PageError>
  </Box>
);

export default ScreenSizeWarning;
