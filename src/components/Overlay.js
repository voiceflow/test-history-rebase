import { css, styled } from '@/hocs';

export const offsetOverlayStyles = (offset) => css`
  left: -${offset}px;
  top: -${offset}px;
  width: calc(100% + ${offset * 2}px);
  height: calc(100% + ${offset * 2}px);
`;

const overlayStyles = css`
  position: absolute;
  border-radius: inherit;
  pointer-events: none;

  ${({ offset = 0 }) => offsetOverlayStyles(offset)}
`;

const Overlay = styled.div`
  ${overlayStyles}
`;

export default Overlay;
