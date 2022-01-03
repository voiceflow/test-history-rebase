import { styled, transition } from '@ui/styles';

export const MenuPopoverContainer = styled.div<{ autoWidth?: boolean; isRoot?: boolean }>`
  z-index: ${({ theme }) => theme.zIndex.popper};
  width: ${({ autoWidth }) => !autoWidth && 'auto !important'};
  margin-top: ${({ isRoot }) => (isRoot ? 0 : -13)}px;
`;

export const FooterActionContainer = styled.div`
  ${transition()};
  cursor: pointer;
  align-content: center;
  width: 100%;
  text-align: center;
  background: #fdfdfd;
  color: ${({ theme }) => theme.colors.blue};
  padding: 24px;
  margin-bottom: -5px;
  border-top: solid 1px #eaeff4;
  position: absolute;
  border-radius: 0 0 5px 5px;
  bottom: 5px;
  :hover {
    color: ${({ theme }) => theme.colors.darkBlue};
  }
`;
