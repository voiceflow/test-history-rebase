import { css, styled } from '@/hocs';

const WIDTH = 250;
const HIDDEN_VISIBLE_WIDTH = 16;
export const SIDEBAR_CONTENT_WIDTH = WIDTH - HIDDEN_VISIBLE_WIDTH;

const Container = styled.aside`
  width: ${WIDTH}px;
  padding-right: ${HIDDEN_VISIBLE_WIDTH}px;

  position: absolute;
  left: 0;
  top: 60px;
  bottom: 60px;

  transform: translateX(-${SIDEBAR_CONTENT_WIDTH}px) translateZ(0);
  transition: transform 350ms cubic-bezier(0.075, 0.82, 0.165, 1);

  ${({ isOpen }) =>
    isOpen &&
    css`
      transform: translateX(0) translateZ(0);
    `}

  &:after {
    display: block;
    width: 4px;
    height: 20px;

    position: absolute;
    top: 50%;
    right: 6px;

    border-radius: 3px;
    opacity: 0.5;
    background-image: linear-gradient(to bottom, rgba(110, 132, 154, 0.85), #6e849a);

    content: '';
    pointer-events: none;
  }
`;

export default Container;
