import { SvgIcon } from '@voiceflow/ui';

import { css, styled } from '@/hocs';

export const ExportIcon = styled(SvgIcon)<{ isOpen?: boolean }>`
  :hover {
    cursor: pointer;
    color: #8da2b5;
  }

  ${({ isOpen }) =>
    isOpen &&
    css`
      color: #3d82e2 !important;
    `}
`;

export default ExportIcon;
