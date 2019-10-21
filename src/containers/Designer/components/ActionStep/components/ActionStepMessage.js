import { css, styled } from '@/hocs';

const ActionStepMessage = styled.div`
  color: #62778c;

  ${({ isPlaceholder }) =>
    isPlaceholder &&
    css`
      color: #8da2b5;
    `}
`;

export default ActionStepMessage;
