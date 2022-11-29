import { Box } from '@voiceflow/ui';

import { styled } from '@/hocs';
import { Section } from '@/pages/Publish/components';

export const SettingsContainer = styled(Box.Flex)`
  flex-direction: column;
  margin: 20px 32px;
  height: 100%;
  overflow-y: scroll;
  max-width: 700px;
`;

export const BannerSection = styled(Section)`
  & ${Section.Card} {
    box-shadow: none;
    background-color: #d3e5f4;
  }
  margin-bottom: 8px;
`;
