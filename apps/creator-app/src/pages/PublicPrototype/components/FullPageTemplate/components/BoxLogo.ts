import { css, styled } from '@/hocs/styled';
import { breakpoints } from '@/styles/breakpoints';

const VF_LOGO = 'https://cdn.voiceflow.com/assets/logomark.png';
const DEFAULT_SIZE = 48;

interface BoxLogoProps {
  url?: string;
  size?: number;
  isMobile?: boolean;
}

const BoxLogo = styled.div<BoxLogoProps>`
  display: inline-block;
  width: ${({ size = DEFAULT_SIZE }) => size}px;
  height: ${({ size = DEFAULT_SIZE }) => size}px;
  margin-bottom: 32px;
  border-radius: 12px;
  border: solid 2px white;
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.08);
  background: url('${({ url = VF_LOGO }) => url}');
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;

  ${({ isMobile }) =>
    isMobile &&
    css`
      position: absolute;
      top: 0;
    `}

  ${({ isMobile }) =>
    typeof isMobile === 'undefined' && // used for PasswordScreen only - TODO and remove all `isMobile` CSS to use media-queries instead.
    breakpoints({
      xs: css`
        position: absolute;
        top: 32px;
      `,
      sm: css`
        position: static;
      `,
    })}
`;

export default BoxLogo;
