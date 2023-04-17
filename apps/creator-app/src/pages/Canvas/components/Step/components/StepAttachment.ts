import { IconButton, IconButtonSquareContainerProps, IconButtonVariant } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';
import { CANVAS_PROTOTYPE_ENABLED_CLASSNAME } from '@/pages/Canvas/constants';

const Attachment = styled(IconButton).attrs({
  variant: IconButtonVariant.SQUARE,
  outlined: true,
  iconProps: { width: 16, heigh: 16 },
})<IconButtonSquareContainerProps>`
  padding: 0;
  width: 36px;
  height: 28px;
  margin-top: -3px;
  margin-bottom: -3px;
  margin-left: 12px;
  pointer-events: all;

  :not(:last-child) {
    margin-right: 4px;
  }

  .${CANVAS_PROTOTYPE_ENABLED_CLASSNAME} & {
    pointer-events: none;
  }
`;

export default Attachment;
