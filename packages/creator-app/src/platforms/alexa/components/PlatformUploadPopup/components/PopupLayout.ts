import { AlexaStageType, AnyStageType } from '@/constants/platforms';
import { css } from '@/hocs';

const PopupLayout = (props?: { jobStage?: AnyStageType | null }) => {
  switch (props?.jobStage) {
    case AlexaStageType.IDLE:
    case AlexaStageType.ERROR:
    case AlexaStageType.WAIT_VENDORS:
      return css`
        width: 254px;
        padding: 0px;
      `;
    case AlexaStageType.SUCCESS:
      return css`
        width: 350px;
        height: auto;
        padding: 0px;
      `;
    default:
      return css`
        width: 254px;
        right: 180px;
        padding: 0px;
      `;
  }
};

export default PopupLayout;
