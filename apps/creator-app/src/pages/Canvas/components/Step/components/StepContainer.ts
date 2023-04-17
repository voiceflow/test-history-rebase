import { Flex, MemberIcon } from '@voiceflow/ui';

import { css, styled } from '@/hocs/styled';
import {
  CANVAS_CREATING_LINK_CLASSNAME,
  NODE_ACTIVE_CLASSNAME,
  NODE_DISABLED_CLASSNAME,
  NODE_HIGHLIGHTED_CLASSNAME,
  NODE_HOVERED_CLASSNAME,
  NODE_MERGE_TARGET_CLASSNAME,
  NODE_THREAD_TARGET_CLASSNAME,
} from '@/pages/Canvas/constants';
import { ClassName } from '@/styles/constants';

import { stepBoxShadowStyles } from '../styles';
import Section from './StepSection';

export interface StepContainerProps {
  canHighlight?: boolean;
  dividerOffset?: number;
}

const StepContainer = styled(Flex)<StepContainerProps>`
  position: relative;
  flex-direction: column;
  min-height: ${({ theme }) => theme.components.blockStep.minHeight}px;
  border-radius: 6px;
  background-color: #fff;
  box-shadow: rgb(0 0 0 / 6%) 0px 0px 0px 1px;

  ${Section}:not(:first-of-type) {
    border-top: 1px solid #eaeff4;

    ${({ dividerOffset }) =>
      dividerOffset &&
      css`
        border-image-source: linear-gradient(to right, transparent ${dividerOffset}px, #eaeff4 1px);
        border-image-slice: 1;
      `}
  }

  ${MemberIcon} {
    position: absolute;
    top: 6px;
    left: 6px;
    transform: translate(-50%, -50%);
    z-index: 99;
  }

  .${ClassName.CANVAS_STEP}.${NODE_ACTIVE_CLASSNAME} &,
  .${ClassName.CANVAS_STEP}.${NODE_HIGHLIGHTED_CLASSNAME} &,
  .${ClassName.CANVAS_STEP}.${NODE_THREAD_TARGET_CLASSNAME} & {
    ${({ theme, canHighlight }) =>
      canHighlight &&
      css`
        box-shadow: ${theme.components.blockStep.activeBorderColor} 0px 0px 0px 1.5px;
      `}
  }

  .${CANVAS_CREATING_LINK_CLASSNAME} .${ClassName.CANVAS_STEP}.${NODE_DISABLED_CLASSNAME} &:hover {
    cursor: not-allowed;
    ${stepBoxShadowStyles}
  }

  .${CANVAS_CREATING_LINK_CLASSNAME} .${ClassName.CANVAS_STEP}.${NODE_HOVERED_CLASSNAME} & {
    ${({ theme }) =>
      css`
        box-shadow: 0 1px 3px 0 rgba(17, 49, 96, 0.06), 0 0 0 1.5px ${theme.components.blockStep.activeBorderColor};
        cursor: copy;
      `}
  }

  .${ClassName.CANVAS_BLOCK}.${NODE_MERGE_TARGET_CLASSNAME} & {
    z-index: -1;
  }
`;

export default StepContainer;
