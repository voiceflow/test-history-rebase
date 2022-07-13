import Flex from '@ui/components/Flex';
import { css, styled, transition } from '@ui/styles';

const calculateRatio = (ratio?: number | null) =>
  ratio
    ? css`
        padding-bottom: ${ratio}%;
      `
    : css`
        height: 100%;
      `;

export const Image = styled.div<{ src: string; ratio?: number }>`
  width: 100%;
  background-size: cover;
  background-position: top center;
  min-height: 30px;
  background-image: url(${({ src }) => src});
`;

export const Controls = styled.div`
  ${transition('opacity')}
  opacity: 0;
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 16px;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 10;
  border-radius: 6px;
  inset: 0;
`;

export const Container = styled.div<{ src: string }>`
  z-index: 1;
  position: relative;
  background-color: #ffffff;
  position: relative;
  border-radius: 6px;
  overflow: hidden;
  width: 100%;

  background-image: url(${({ src }) => src});
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  &:before {
    content: '';
    border-radius: 6px;
    display: block;
    position: absolute;
    -webkit-backdrop-filter: blur(16px);
    backdrop-filter: blur(16px);
    background-color: rgba(0, 0, 0, 0.08);
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }

  &:hover ${Controls} {
    opacity: 1;
  }
`;

const reversePercent = (percentage: number, value: number) => (value / percentage) * 100;

export const ImageViewport = styled(Flex)<{ isActive?: boolean; autoHeight?: boolean; ratio?: number | null }>`
  position: relative;
  color: #62778c;
  background-color: #ffffff;
  margin: 0 auto;

  height: ${({ autoHeight, theme }) => (autoHeight ? 'auto' : `${theme.components.uploadV2.image.height}px`)};

  ${({ ratio, autoHeight, theme }) =>
    !autoHeight &&
    ratio &&
    css`
      max-width: ${reversePercent(ratio, theme.components.uploadV2.image.height)}px;
    `}

  ${Image} {
    ${({ ratio }) => calculateRatio(ratio)}
  }

  &:focus {
    outline: none;
  }
`;
