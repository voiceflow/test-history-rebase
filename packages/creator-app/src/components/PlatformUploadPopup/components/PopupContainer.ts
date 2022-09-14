import { Popper } from '@voiceflow/ui';
import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { AnyStageType } from '@/constants/platforms';
import { styled } from '@/hocs/styled';

import { getPlatformPopupLayout } from '../constants';

export interface PopupContainerProps {
  open?: boolean;
  jobStage?: AnyStageType | null;
  multiSelect?: boolean;
  width?: number;
  platform: VoiceflowConstants.PlatformType;
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

  ${({ platform, jobStage, multiSelect }) => getPlatformPopupLayout(platform)({ jobStage, multiSelect })};
`;

export default PopupContainer;
