import { AnyStageType, DialogflowStageType } from '@/constants/platforms';
import { css } from '@/hocs';

const PopupLayout = (props?: { jobStage?: AnyStageType | null }) => {
  switch (props?.jobStage) {
    case DialogflowStageType.IDLE:
    case DialogflowStageType.WAIT_PROJECT:
      return css`
        width: 264px;
        padding: 0px;
      `;

    case DialogflowStageType.SUCCESS:
    case DialogflowStageType.ERROR:
      return css`
        width: 350px;
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
