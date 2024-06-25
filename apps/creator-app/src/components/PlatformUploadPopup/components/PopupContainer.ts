import type * as Platform from '@voiceflow/platform-config';
import { Popper } from '@voiceflow/ui';

import type { AnyStageType } from '@/constants/platforms';
import { styled } from '@/hocs/styled';

export interface PopupContainerProps {
  open?: boolean;
  jobStage?: AnyStageType | null;
  width?: number;
  platform: Platform.Constants.PlatformType;
}

const PopupContainer = styled.div<PopupContainerProps>`
  display: ${({ open }) => (open ? 'flex' : 'none')};
  position: absolute;
  z-index: 1000;
  flex-direction: column;
  align-items: center;
  white-space: normal;
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  transform: translate3d(0, 0, 0);

  ${({ open, jobStage }) => open && jobStage && Popper.baseStyles}
`;

export default PopupContainer;
