import Flex, { FlexCenter } from '@/components/Flex';
import { css, styled } from '@/styles';
import { fontResetStyle } from '@/styles/bootstrap';

const calculateRatio = (ratio?: number) =>
  ratio
    ? css`
        padding-bottom: ${ratio}%;
      `
    : css`
        height: 100%;
      `;

export const Container = styled(Flex)<{ isActive?: boolean; autoHeight?: boolean; height?: number }>`
  border-radius: 5px;
  height: ${({ autoHeight, height, theme }) =>
    autoHeight ? 'auto' : `${height || theme.components.imageUpload.height}px`};

  position: relative;
  color: #62778c;

  &:focus {
    outline: none;
  }

  ${({ isActive }) =>
    isActive &&
    css`
      outline: none;
    `}
`;

export const Image = styled.div<{ src: string; ratio?: number }>`
  width: 100%;
  border-radius: 5px;
  background-size: cover;
  background-position: top center;
  min-height: 30px;
  background-image: url(${({ src }) => src});

  ${({ ratio }) => calculateRatio(ratio)}
`;

export const ImageContainer = styled(FlexCenter)`
  width: 100%;
  height: 100%;
  border: 1px solid #d4d9e6;
  cursor: pointer;
  border-radius: 5px;
  overflow: hidden;
`;

export const ImageUploadInput = styled.input`
  ${fontResetStyle};
  display: none;
`;
