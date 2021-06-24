import { styled } from '../../../styles';

// eslint-disable-next-line import/prefer-default-export
export const MenuPopoverContainer = styled.div`
  z-index: 1100;
  width: ${({ autoWidth }) => !autoWidth && 'auto !important'};
  margin-top: ${({ isRoot }) => (isRoot ? 0 : -13)}px;
`;
