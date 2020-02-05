import { css, styled } from '@/hocs';

const ExpressionGroup = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  font-weight: 600;
  text-align: center;
  border-bottom: 1px solid #eaeff4;

  /* "Expression" */
  ${({ size }) =>
    size === 1 &&
    css`
      grid-template-columns: 1fr;
      border-bottom: none;
    `}

  /* "Value", "Variable" */
  ${({ size }) =>
    size === 2 &&
    css`
      grid-template-columns: 1fr 1fr;
    `} 

  /* "+", "-", "x", "÷" */
  ${({ size }) =>
    size === 4 &&
    css`
      grid-template-columns: 1fr 1fr 1fr 1fr;
    `}
`;

export default ExpressionGroup;
