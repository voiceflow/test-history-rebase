import { styled, units } from '@/hocs';

const ErrorMessage = styled.p`
  padding-top: ${units(2)}px;
  color: #e91e63;
  font-size: 13px;
`;

export const ErrorMessageWithDivider = styled(ErrorMessage)`
  margin-right: -${units(4)}px;
  padding: ${units(2)}px 0;
  border-bottom: 1px solid #eaeff4;
`;

export default ErrorMessage;
