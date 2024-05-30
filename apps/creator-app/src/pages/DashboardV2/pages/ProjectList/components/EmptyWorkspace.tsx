import { Box, SvgIcon, Text } from '@voiceflow/ui';
import React from 'react';

const EmptyWorkspace: React.FC = () => (
  <Box.FlexCenter flexDirection="column" width="100%" height="100%">
    <SvgIcon icon="noContent" size={80} />

    <Text color="#132144" fontWeight={600} paddingTop="16px" paddingBottom="8px">
      No agents exist
    </Text>

    <Text color="#62778C" width="250px" textAlign="center">
      Workspace agents will appear here when one is created
    </Text>
  </Box.FlexCenter>
);

export default EmptyWorkspace;
