import { VoiceflowConstants } from '@voiceflow/voiceflow-types';

import { AnyStageType } from '@/constants/platforms';
import { css, styled } from '@/hocs';

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
  border-radius: 5px;
  overflow: hidden;
  transform: translate3d(0, 0, 0);

  ${({ open, jobStage }) =>
    open &&
    jobStage &&
    css`
      box-shadow: 0 0 0 1px rgba(17, 49, 96, 0.06), 0 8px 16px 0 rgba(17, 49, 96, 0.16);
    `}

  ${({ platform, jobStage, multiSelect }) => getPlatformPopupLayout(platform)({ jobStage, multiSelect })};
`;

export default PopupContainer;
