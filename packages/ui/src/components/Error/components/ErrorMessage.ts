import { styled, units } from '@ui/styles';
import { space, SpaceProps } from 'styled-system';

export interface ErrorMessageProps extends SpaceProps {}

const ErrorMessage = styled.p<ErrorMessageProps>`
  padding-top: 12px;
  color: #bd425f;
  font-size: 13px;
  line-height: normal;
  ${space}
`;

export const ErrorMessageWithDivider = styled(ErrorMessage)`
  margin-right: -${units(4)}px;
  padding: ${units(2)}px 0;
  border-bottom: 1px solid #eaeff4;
`;

export default ErrorMessage;
