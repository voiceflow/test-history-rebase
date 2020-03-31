import OverflowText from '@/components/Text/OverflowText';
import { css, styled } from '@/hocs';

const StepLabelText = styled(OverflowText)`
  ${({ onClick }) =>
    onClick &&
    css`
      :hover {
        color: #4d8de6;
      }
    `}
`;

export default StepLabelText;
