import { Input } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

export const MenuSearchInput = styled(Input).attrs({
  icon: 'search',
  iconProps: { color: 'rgba(110,132, 154, 0.85)' },
})`
  height: 42px;
  width: 100%;
  padding: 0 24px;
  border-radius: 0;
  border: none !important;
  box-shadow: none !important;
  border-bottom: 1px solid ${({ theme }) => theme.colors.separatorSecondary} !important;
  padding-bottom: 8px;
  margin-bottom: 8px;
`;
