import { Box, ThemeColor } from '@voiceflow/ui';
import React from 'react';

import { styled } from '@/hocs';

const Card = styled(Box)`
  border-radius: 5px;
  box-shadow: 0 1px 3px 0 rgba(17, 49, 96, 0.08), 0 0 1px 1px rgba(17, 49, 96, 0.08);
  background-color: white;
  padding: 24px 32px;

  color: ${({ theme }) => theme.colors.secondary};
`;

const Divider = styled(Box)`
  margin: 24px -32px;
  background-color: #eaeff4;
  height: 1px;
`;

const Section: React.FC<{ title?: JSX.Element | string; subtitle?: JSX.Element | string; card?: boolean; className?: string }> = ({
  title,
  subtitle,
  children,
  card = true,
  className,
}) => (
  <Box width="100%" p={12} className={className}>
    <Box fontWeight={600} mb={16}>
      {title}
      {subtitle && (
        <Box fontSize={13} fontWeight={400} color={ThemeColor.SECONDARY}>
          {subtitle}
        </Box>
      )}
    </Box>
    {card ? <Card>{children}</Card> : children}
  </Box>
);

export default Object.assign(Section, { Card, Divider });
