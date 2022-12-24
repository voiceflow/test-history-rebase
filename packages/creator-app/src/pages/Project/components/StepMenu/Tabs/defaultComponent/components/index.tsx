import { styled } from '@/hocs/styled';

interface TabTextProps {
  isActiveTab: boolean;
}

export const TabText = styled.div<TabTextProps>`
  color: ${({ isActiveTab, theme }) => (isActiveTab ? theme.colors.darkerBlue : theme.colors.quaternary)};
  font-size: 13px;
  font-weight: ${({ theme }) => theme.font.weight.semibold};
  cursor: pointer;
`;
