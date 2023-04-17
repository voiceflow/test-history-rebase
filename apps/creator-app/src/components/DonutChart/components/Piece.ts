import { css, styled, transition } from '@/hocs/styled';

interface PieceProps {
  color: string;
  rotate: number;
  border: boolean;
  isHovered?: boolean;
}

const Piece = styled.div<PieceProps>`
  ${transition('opacity')};

  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: ${({ color }) => color};
  transform: rotate(${({ rotate }) => rotate}deg);
  opacity: ${({ isHovered }) => (isHovered ? 0.6 : 1)};
  transform-origin: right;
  pointer-events: all;

  ${({ border }) =>
    border &&
    css`
      border-right: 1px solid #fff;
    `}
`;

export default Piece;
