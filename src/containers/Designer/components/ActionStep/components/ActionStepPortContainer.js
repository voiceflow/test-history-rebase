import { SvgIconContainer } from '@/components/SvgIcon';
import { css, styled } from '@/hocs';

const ActionStepPortContainer = styled.div`
  cursor: copy;

  & ${SvgIconContainer} {
    color: #3a5999;
  }

  ${({ disabled }) =>
    disabled &&
    css`
      cursor: not-allowed;
      opacity: 0.4;
    `}
`;

export default ActionStepPortContainer;
