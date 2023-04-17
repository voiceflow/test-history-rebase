import { Popper } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

export const PopupContainer = styled.div`
  display: 'flex';
  z-index: 1000;
  flex-direction: column;
  align-items: center;
  white-space: normal;
  background-color: #fff;
  overflow: hidden;
  transform: translate3d(0, 0, 0);

  ${Popper.baseStyles}
`;

export const CloseContainer = styled.div`
  color: #6e849a;
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 10px;
`;
