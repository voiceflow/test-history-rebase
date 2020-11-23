import { AlexaStageType, GoogleStageType } from '@/constants/platforms';
import { css, keyframes, styled } from '@/hocs';
import { ANIMATION_SPEED } from '@/styles/theme';

import PopupCloseIcon from './PopupCloseIcon';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

export type PopupContainerProps = {
  open?: boolean;
  jobStage?: AlexaStageType | GoogleStageType | null;
  projectExists?: boolean;
};

const PopupContainer = styled.div<PopupContainerProps>`
  display: ${({ open }) => (open ? 'flex' : 'none')};
  position: absolute;
  top: 62px;
  right: 15px;
  z-index: 1;
  flex-direction: column;
  align-items: center;
  min-width: 350px;
  max-width: 350px;
  white-space: normal;
  background-color: #fff;
  border-radius: 5px;
  box-shadow: 0 0 0 1px rgba(17, 49, 96, 0.06), 0 8px 16px 0 rgba(17, 49, 96, 0.16);
  overflow: hidden;
  transform: translate3d(0, 0, 0);
  animation: ${fadeIn} ${ANIMATION_SPEED}s ease-in-out;

  ${PopupCloseIcon} {
    position: absolute;
    top: 0px;
    right: 0px;
    padding: 18px;
    z-index: 100;
  }

  ${({ jobStage, projectExists }) => {
    // eslint-disable-next-line sonarjs/no-small-switch
    switch (jobStage) {
      case GoogleStageType.WAIT_PROJECT:
        if (projectExists) {
          return css`
            min-width: 254px;
            max-width: 254px;
            right: 180px;
            padding: 0px;
          `;
        }
        return css`
          min-width: 420px;
          max-width: 420px;
          right: 110px;
          padding: 0px;
        `;

      case GoogleStageType.SUCCESS:
      case GoogleStageType.ERROR:
        return css`
          min-width: 420px;
          max-width: 420px;
          right: 110px;
        `;
      default:
        return css``;
    }
  }}
`;

export default PopupContainer;
