import { css, styled } from '@/hocs/styled';

interface PageProgressBarProps {
  easing?: string;
  progress: number;
  duration?: number;
}

const PageProgressBar = styled.div<PageProgressBarProps>`
  position: fixed;
  height: 2px;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2000;
  background-color: ${({ theme }) => theme.colors.darkerBlue};
  transition: transform ${({ easing = 'ease-in-out', duration = 0.3 }) => `${duration}s ${easing}`};
  transform-origin: center left;

  ${({ progress }) =>
    progress >= 0
      ? css`
          transform: scaleX(${progress / 100});
        `
      : css`
          display: none;
          transform: scaleX(0);
        `}
`;

export default PageProgressBar;
