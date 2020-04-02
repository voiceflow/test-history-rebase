import Flex from '@/components/Flex';
import { MemberIcon } from '@/components/User';
import { css, styled } from '@/hocs';
import { MERGE_ACTIVE_NODE_CLASSNAME } from '@/pages/Canvas/constants';

import { stepBoxShadowStyles } from '../styles';
import Section from './StepSection';

export type StepContainerProps = {
  isActive?: boolean;
  isHovered?: boolean;
  hasLinkWarning?: boolean;
};

const StepContainer = styled(Flex)<StepContainerProps>`
  position: relative;
  flex-direction: column;
  min-height: ${({ theme }) => theme.components.blockStep.minHeight}px;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 1px 3px 0 rgba(17, 49, 96, 0.06),
    0 0 0 1px ${({ isActive, theme }) => (isActive ? theme.components.blockStep.activeBorderColor : 'rgba(17, 49, 96, 0.08)')};

  ${({ isHovered, theme }) =>
    isHovered &&
    css`
      box-shadow: 0 1px 3px 0 rgba(17, 49, 96, 0.06), 0 0 0 1px ${theme.components.blockStep.activeBorderColor};
      cursor: copy;
    `}

  &:hover {
    ${({ hasLinkWarning }) =>
      hasLinkWarning &&
      css`
        opacity: 0.7;
        cursor: not-allowed;
        ${stepBoxShadowStyles}
      `}
  }

  ${Section}:not(:first-of-type) {
    border-top: 1px solid #eaeff4;
  }

  ${MemberIcon} {
    position: absolute;
    top: 6px;
    left: 6px;
    transform: translate(-50%, -50%);
    z-index: 99;
  }

  .${MERGE_ACTIVE_NODE_CLASSNAME} & {
    z-index: -1;
  }
`;

export default StepContainer;
