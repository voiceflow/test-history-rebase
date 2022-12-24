import { css, styled } from '@/hocs/styled';

export enum BorderPosition {
  TOP = 'top',
  LEFT = 'left',
  RIGHT = 'right',
  BOTTOM = 'bottom',
}

const Border = styled.div<{ scale: number; position: BorderPosition }>`
  position: absolute;
  color: transparent;
  pointer-events: none;
  background-color: currentColor;

  ${({ scale, position }) => {
    switch (position) {
      case BorderPosition.TOP:
        return css`
          top: 0;
          left: 0;
          right: 0;
          height: 1px;
          transform: scaleY(${1 / scale});
          transform-origin: top center;
        `;
      case BorderPosition.BOTTOM:
        return css`
          left: 0;
          right: 0;
          bottom: 0;
          height: 1px;
          transform: scaleY(${1 / scale});
          transform-origin: bottom center;
        `;
      case BorderPosition.LEFT:
        return css`
          top: 0;
          left: 0;
          bottom: 0;
          width: 1px;
          transform: scaleX(${1 / scale});
          transform-origin: center left;
        `;
      case BorderPosition.RIGHT:
        return css`
          top: 0;
          right: 0;
          bottom: 0;
          width: 1px;
          transform: scaleX(${1 / scale});
          transform-origin: center right;
        `;
      default:
        return '';
    }
  }}
`;

export default Border;
