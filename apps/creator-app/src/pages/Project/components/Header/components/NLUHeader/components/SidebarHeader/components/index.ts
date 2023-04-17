import { css, styled, transition } from '@/hocs/styled';

export const SidebarHeaderContainer = styled.div`
  font-weight: 600;
  color: #132144;
  display: flex;
  font-weight: 600;
  color: #132144;
  padding: 20px 24px 20px 8px;
  justify-content: space-between;
  min-width: ${({ theme }) => theme.components.navSidebar.width - 16}px;
  border-right: 1px solid ${({ theme }) => theme.colors.borders};
`;

export const ErrorBubble = styled.div<{ active: boolean }>`
  ${transition()}
  padding: 2px 8px;
  background: white;
  border-radius: 6px;
  display: flex;
  align-items: center;
  border: solid 1px #dfe3ed;
  cursor: pointer;
  color: #62778c;

  ${({ active }) =>
    active &&
    css`
      background: #eef4f6;
      border-collapse: #dfe3ed;
    `}
`;
