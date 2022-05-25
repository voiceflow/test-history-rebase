import { IconButton, IconButtonSquareContainerProps, IconButtonVariant } from '@voiceflow/ui';

import { styled } from '@/hocs';
import { CANVAS_PROTOTYPE_ENABLED_CLASSNAME } from '@/pages/Canvas/constants';

const StepButton = styled(IconButton).attrs({
  variant: IconButtonVariant.SQUARE,
  outlined: true,
  iconProps: { width: 16, heigh: 16 },
})<IconButtonSquareContainerProps>`
  padding: 0;
  width: 40px;
  height: 28px;
  pointer-events: all;
  border-radius: 6px;
  margin-top: -3px;
  margin-bottom: -3px;

  :not(:last-child) {
    margin-right: 4px;
  }

  .${CANVAS_PROTOTYPE_ENABLED_CLASSNAME} & {
    pointer-events: none;
  }
`;

export default StepButton;
