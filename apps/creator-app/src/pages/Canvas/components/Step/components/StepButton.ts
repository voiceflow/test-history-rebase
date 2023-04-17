import { IconButton, IconButtonSquareContainerProps, IconButtonVariant } from '@voiceflow/ui';

import { styled, units } from '@/hocs/styled';
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

  :not(:last-of-type) {
    margin-right: 4px;
  }

  .${CANVAS_PROTOTYPE_ENABLED_CLASSNAME} & {
    pointer-events: none;
  }
`;

export const StepCarouselButton = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 42px;
  padding: 0 ${units(2)}px;
  border: 1px solid #dfe3ed;
  line-height: 1;
  border-radius: 6px;
  width: 100%;
  color: #132144;
  font-weight: 600;
`;

export const StepCarouselButtonGroup = styled.div`
  width: 100%;

  ${StepCarouselButton} {
    max-width: calc(100% - 24px);
  }

  > :not(:first-of-type) ${StepCarouselButton} {
    margin-top: -1px;
    border-top-left-radius: 0 !important;
    border-top-right-radius: 0 !important;
    border-top-color: #eaeff4;
  }

  > :not(:last-of-type) ${StepCarouselButton} {
    border-bottom-color: #eaeff4;
    border-bottom-left-radius: 0 !important;
    border-bottom-right-radius: 0 !important;
  }
`;

export default StepButton;
