import { Box, Button, ThemeColor } from '@voiceflow/ui';
import React from 'react';

import { styled } from '@/hocs';
import { onOpenInternalURLInANewTabFactory } from '@/utils/window';

import Section from './Section';

export const BannerSection = styled(Section)`
  & ${Section.Card} {
    box-shadow: none;
    background-color: #d3e5f4;
  }
  margin-bottom: 8px;
`;

export interface PublishBannerProps {
  title: string;
  description: string;
  docUrl: string;
}

const PublishBanner: React.FC<PublishBannerProps> = ({ title, description, docUrl }) => (
  <BannerSection>
    <Box.FlexApart>
      <div>
        <Box fontWeight={700} fontSize={18} color={ThemeColor.PRIMARY} mb={2}>
          {title}
        </Box>
        {description}
      </div>
      <Button onClick={onOpenInternalURLInANewTabFactory(docUrl)}>Documentation</Button>
    </Box.FlexApart>
  </BannerSection>
);

export default Object.assign(PublishBanner, {
  BannerSection,
});
