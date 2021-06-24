import { Input as BaseInput } from '@voiceflow/ui';

import { css, styled } from '@/hocs';

const Input = styled(BaseInput as any)<{ showdropdown: boolean; error: boolean }>`
  border-top-right-radius: 6px;
  border-bottom-right-radius: 6px;
  border-right: 1px solid #d2dae2 !important;
  height: ${({ theme }) => theme.components.input.height}px;

  ${({ error }) =>
    error &&
    css`
      border-right: 1px solid #e91e63 !important;
      border-color: #e91e63 !important;
    `}

  ${({ showdropdown }) =>
    showdropdown &&
    css`
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right: 0 !important;
    `}
`;

export default Input;
