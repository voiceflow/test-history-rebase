import { styled } from '@/hocs';

export const MenuPopoverContainer = styled.div`
  width: ${({ autoWidth }) => !autoWidth && 'auto !important'};
  z-index: 1100;
`;
