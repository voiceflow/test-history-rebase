import { css, styled } from '@/hocs/styled';

interface StageContainerProps {
  width?: number;
  height?: number;
  noPadding?: boolean;
  padding?: string;
}

const StageContainer = styled.div<StageContainerProps>`
  width: 100%;
  padding: 22px;
  text-align: center;

  ${({ width }) =>
    width &&
    css`
      width: ${width}px;
    `}

  ${({ height }) =>
    height &&
    css`
      height: ${height}px;
    `}

  ${({ noPadding }) =>
    noPadding &&
    css`
      padding: 0px;
    `}

  ${({ padding }) =>
    padding &&
    css`
      padding: ${padding};
    `}
`;

export default StageContainer;
