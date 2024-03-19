import { FlexCenter } from '@voiceflow/ui';
import { Tokens } from '@voiceflow/ui-next/styles';

import { css, styled } from '@/hocs/styled';

const LogoContainer = styled(FlexCenter)<{ size?: number; shadow?: boolean; oldLogo?: boolean }>`
  border-radius: 50%;

  ${({ size = 52 }) => css`
    min-height: ${size}px;
    min-width: ${size}px;
  `}

  ${({ shadow = true }) =>
    shadow &&
    css`
      box-shadow: 0 8px 16px 0 rgba(17, 49, 96, 0.16), 0 0 0 1px rgba(17, 49, 96, 0.06);
    `}

  ${({ oldLogo = true }) =>
    oldLogo
      ? css`
          background-image: linear-gradient(to bottom, rgba(19, 33, 68, 0.85), #132144);
        `
      : css`
          background-color: ${Tokens.colors.black[100]};
        `}


  margin-bottom: 21px;
`;

export default LogoContainer;
