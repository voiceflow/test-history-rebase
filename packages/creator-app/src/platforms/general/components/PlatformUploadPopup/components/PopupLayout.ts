import { AnyStageType } from '@/constants/platforms';
import { css } from '@/hocs';

const PopupLayout = (props?: { jobStage?: AnyStageType | null; multiSelect?: boolean }) => {
  if (props?.multiSelect) {
    return css`
      width: 254px;
      right: 180px;
      padding: 0px;
    `;
  }

  return css`
    width: 254px;
    right: 180px;
    padding: 0px;
  `;
};

export default PopupLayout;
