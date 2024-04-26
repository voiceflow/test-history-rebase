import { css, styled } from '@/hocs/styled';

interface ContainerProps {
  avatarUrl?: string | null;
  noShadow?: boolean;
  noHover?: boolean;
  rgbColor?: { hex: string; rgbaFrom: string; rgbaTo: string } | null;
}

export const Container = styled.div<ContainerProps>`
  font-weight: 600;
  font-size: 19px;
  text-align: center;
  background-repeat: no-repeat;
  background-position: 50% 50%;
  background-size: cover;
  border-radius: 50%;
  display: flex;
  ${({ noShadow }) =>
    !noShadow &&
    css`
      box-shadow:
        inset 0 0 0 1px #fff,
        0 0 0 1px #fff,
        0 1px 2px 1px rgba(17, 49, 96, 0.16);
    `};

  ${({ rgbColor, avatarUrl, noShadow }) => css`
    ${rgbColor &&
    css`
      color: ${rgbColor.hex};
    `}
    background-color: #fff;
    background-image: ${avatarUrl
      ? `url(${avatarUrl}) `
      : rgbColor && `linear-gradient(-180deg, ${rgbColor.rgbaFrom} 0%, ${rgbColor.rgbaTo} 97%)`};

    transition: box-shadow 0.15s linear;
    ${!noShadow &&
    css`
      box-shadow:
        inset 0 0 0 1px #fff,
        0 0 0 1px #fff,
        0 1px 2px 1px rgba(17, 49, 96, 0.16);
    `};
  `}

  ${({ noHover }) =>
    !noHover &&
    css`
      :hover {
        border: 1px solid #fff;
      }
    `}
`;
