import { styled, transition } from '@ui/styles';

export const MenuPopoverContainer = styled.div<{ autoWidth?: boolean; isRoot?: boolean; minWidth?: number }>`
  z-index: ${({ theme }) => theme.zIndex.popper};
  width: ${({ autoWidth }) => !autoWidth && 'auto !important'};
  margin-top: ${({ isRoot }) => (isRoot ? 0 : -13)}px;
  min-width: ${({ minWidth }) => minWidth && `${minWidth}px`};
`;

export const FooterActionContainer = styled.div`
  ${transition('color')};
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

export const FooterActions = styled.div`
  width: 100%;
  text-align: center;
  background: #fdfdfd;
  color: ${({ theme }) => theme.colors.blue};
  margin-bottom: -5px;
  border-top: solid 1px #eaeff4;
  position: absolute;
  border-radius: 0 0 5px 5px;
  bottom: 5px;
  display: flex;
`;

export const FooterAction = styled.div`
  ${transition('color')};
  align-content: center;
  padding: 22px 18px;
  flex-grow: 1;
  cursor: pointer;

  &:not(:first-child) {
    border-left: 1px solid #eaeff4;
  }

  :hover {
    color: ${({ theme }) => theme.colors.darkBlue};
  }
`;
