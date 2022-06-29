import { styled } from '@ui/styles';

export const Container = styled.div<{ scrolled?: boolean }>`
  position: sticky;
  top: 0px;
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 32px;
  padding: 12px 32px;

  background-color: #fdfdfd;

  width: 100%;
  border-bottom: solid 1px ${({ theme }) => theme.colors.separator};
  z-index: 2;
`;
