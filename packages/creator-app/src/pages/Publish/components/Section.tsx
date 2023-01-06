import { Box, ThemeColor } from '@voiceflow/ui';
import React from 'react';
import { space } from 'styled-system';

import { styled } from '@/hocs/styled';

const Card = styled(Box)`
  border-radius: 8px;
  box-shadow: rgb(17 49 96 / 10%) 0px 0px 0px 1px, rgb(17 49 96 / 8%) 0px 1px 3px 0px;
  background-color: white;
  padding: 24px 32px;

  color: ${({ theme }) => theme.colors.secondary};

  ${space}
`;

const Divider = styled(Box)`
  margin: 24px -32px;
  background-color: #eaeff4;
  height: 1px;
`;

const Section: React.OldFC<{ title?: JSX.Element | string; subtitle?: JSX.Element | string; card?: boolean; className?: string }> = ({
  title,
  subtitle,
  children,
  card = true,
  className,
}) => (
  <Box width="100%" className={className}>
    <Box fontWeight={600} mb={16}>
      {title}
      {subtitle && (
        <Box mt={4} fontSize={13} fontWeight={400} color={ThemeColor.SECONDARY}>
          {subtitle}
        </Box>
      )}
    </Box>
    {card ? <Card>{children}</Card> : children}
  </Box>
);

export default Object.assign(Section, { Card, Divider });
