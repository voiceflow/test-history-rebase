import { flexStyles, units } from '@voiceflow/ui';

import { styled } from '@/hocs/styled';

import StepItemContainer from './StepItemContainer';

const StepSection = styled.section<{ v2?: boolean; withIcon?: boolean }>`
  ${flexStyles}

  flex-direction: column;
  width: 100%;

  ${StepItemContainer}:not(:first-of-type)::before {
    position: absolute;
    top: -1px;
    height: 1px;
    left: ${units(6.5)}px;

    ${({ v2, withIcon }) =>
      v2 &&
      `
      left: ${withIcon ? '54px' : '22px'};
    `};

    right: 0;
    content: '';
    border-top: 1px solid #eaeff4;
  }
`;

export default StepSection;
