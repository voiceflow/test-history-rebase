import { DropdownButton as BaseDropdownButton } from '@/components/ButtonDropdownInput/components';
import { css, styled } from '@/hocs';

const DropdownButton: any = styled(BaseDropdownButton as any)<{ error?: boolean }>`
  padding-right: 16px;

  ${({ error }) =>
    error &&
    css`
      border-left: 0 !important;
    `}
`;

export default DropdownButton;
