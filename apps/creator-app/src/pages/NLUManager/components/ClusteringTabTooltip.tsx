import { Box, Button as UIButton, Preview } from '@voiceflow/ui';
import React from 'react';

import { styled } from '@/hocs/styled';

export const MoreButton = styled(UIButton.DarkButton)`
  padding: 10px 0px;
  font-size: 13px;
`;

const ClusteringTabTooltip: React.FC = () => {
  return (
    <Preview style={{ maxWidth: '232px' }}>
      <Preview.Content style={{ padding: '10px 16px 12px 16px' }}>
        <Preview.Title>Clustering</Preview.Title>

        <Box mt="4px" lineHeight="18px">
          <Preview.Text>When on, utterances are automatically clustered into groups based on their similarity.</Preview.Text>
        </Box>
      </Preview.Content>

      <Box p="0px 4px 4px 4px">
        <MoreButton onClick={() => null}>More</MoreButton>
      </Box>
    </Preview>
  );
};

export default ClusteringTabTooltip;
