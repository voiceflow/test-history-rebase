import { css, styled } from '@/hocs';
import { LogoContainer } from '@/pages/Onboarding/Steps/Welcome/components';

type LogoCircleProps = {
  forAvatar?: boolean;
};

// eslint-disable-next-line import/prefer-default-export
export const LogoCircle = styled(LogoContainer)<LogoCircleProps>`
  position: absolute;
  top: 8px;
  left: -45px;
  box-shadow: 0 0 0 1px #fff, 0 0 0 2px rgba(19, 33, 68, 0.04);

  ${({ forAvatar }) =>
    forAvatar &&
    css`
      & > * {
        padding: 16px;
      }
    `}
`;
