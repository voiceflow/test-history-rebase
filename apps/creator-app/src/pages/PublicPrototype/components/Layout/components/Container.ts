import { css, styled, transition } from '@/hocs/styled';

interface ContainerProps {
  isMobile?: boolean;
  isVisuals?: boolean;
  isFullScreen?: boolean;
  splashScreenPassed?: boolean;
  height?: string;
}

const Container = styled.div<ContainerProps>`
  ${transition('color')};

  position: relative;
  display: flex;
  width: 100%;
  height: 100%;
  background-color: ${({ isMobile, isVisuals, splashScreenPassed }) =>
    !isMobile && (!isVisuals || splashScreenPassed) ? '#f6f6f6' : '#fff'};

  ${({ isMobile, isVisuals }) =>
    !isMobile &&
    !isVisuals &&
    css`
      align-items: center;
    `}

  ${({ isMobile, isVisuals, splashScreenPassed }) =>
    !isMobile &&
    (!isVisuals || !splashScreenPassed) &&
    css`
      justify-content: center;
    `}
`;

export default Container;
