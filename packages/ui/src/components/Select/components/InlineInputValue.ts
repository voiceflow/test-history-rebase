import { inputStyle } from '@ui/components/Input';
import { css, styled } from '@ui/styles';

const InlineInputValue = styled.div<{ isSecondary?: boolean }>`
  ${inputStyle}
  position: absolute;
  bottom: 0;
  left: -100%;
  display: inline-block;
  width: auto;
  padding-right: 34px;
  padding-left: 16px;
  visibility: hidden;

  ${({ isSecondary }) =>
    isSecondary &&
    css`
      color: #62778c;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
    `}
`;

export default InlineInputValue;
