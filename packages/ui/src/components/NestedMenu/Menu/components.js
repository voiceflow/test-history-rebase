import { styled, transition } from '../../../styles';

export const MenuPopoverContainer = styled.div`
  z-index: 1100;
  width: ${({ autoWidth }) => !autoWidth && 'auto !important'};
  margin-top: ${({ isRoot }) => (isRoot ? 0 : -13)}px;
`;

export const FooterActionContainer = styled.div`
  ${transition()};
  cursor: pointer;
  align-content: center;
  width: 100%;
  text-align: center;
  background: white;
  color: ${({ theme }) => theme.colors.blue};
  padding: 24px;
  border-top: solid 1px #eaeff4;
  position: absolute;
  bottom: 0px;
  :hover {
    color: ${({ theme }) => theme.colors.darkBlue};
  }
`;
