import { FlexApart } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';
import THEME from '@/styles/theme';

export const Header = styled(FlexApart)`
  padding: 16px 24px;
  font-size: 13px;
  background: rgba(249, 249, 249, 0.6);
`;

export const Title = styled(FlexApart)`
  text-transform: uppercase;
  color: ${THEME.colors.secondary};
  font-weight: 600;
`;
