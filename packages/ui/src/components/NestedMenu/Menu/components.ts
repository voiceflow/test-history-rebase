import { styled } from '@ui/styles';

export const MenuPopoverContainer = styled.div<{ autoWidth?: boolean; isRoot?: boolean; minWidth?: number; maxWidth?: number }>`
  z-index: ${({ theme }) => theme.zIndex.popper};
  width: ${({ autoWidth }) => !autoWidth && 'auto !important'};
  margin-top: ${({ isRoot }) => (isRoot ? 0 : -13)}px;
  min-width: ${({ minWidth }) => minWidth && `${minWidth}px`};
  max-width: ${({ maxWidth }) => maxWidth && `${maxWidth}px`};
`;
