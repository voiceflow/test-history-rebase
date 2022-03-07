import { css, styled, units } from '@ui/styles';

const ErrorMessage = styled.p<{ noMarginBottom?: boolean }>`
  padding-top: 12px;
  color: #e91e63;
  font-size: 13px;

  ${({ noMarginBottom }) =>
    noMarginBottom &&
    css`
      margin-bottom: 0px;
    `}
`;

export const ErrorMessageWithDivider = styled(ErrorMessage)`
  margin-right: -${units(4)}px;
  padding: ${units(2)}px 0;
  border-bottom: 1px solid #eaeff4;
`;

export default ErrorMessage;
