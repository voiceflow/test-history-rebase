import { FlexCenter } from '@voiceflow/ui';
import { Tokens } from '@voiceflow/ui-next/styles';

import { css, styled } from '@/hocs/styled';

export const Container = styled.div`
  padding-top: 250px;
  padding-top: 25vh;
`;

export const LogoContainer = styled(FlexCenter)<{ size?: number; shadow?: boolean }>`
  border-radius: 50%;

  ${({ size = 52 }) => css`
    min-height: ${size}px;
    min-width: ${size}px;
  `}

  ${({ shadow = true }) =>
    shadow &&
    css`
      box-shadow:
        0 8px 16px 0 rgba(17, 49, 96, 0.16),
        0 0 0 1px rgba(17, 49, 96, 0.06);
    `}

  background-color: ${Tokens.colors.black[100]};
  margin-bottom: 21px;
`;
