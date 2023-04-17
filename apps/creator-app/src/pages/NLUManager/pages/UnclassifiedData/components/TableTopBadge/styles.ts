import { styled, transition } from '@/hocs/styled';

export const BadgeContainer = styled.div`
  ${transition('left', 'top')}
  position: absolute;
  left: 55%;
  z-index: 1;
  top: 16px;
`;
