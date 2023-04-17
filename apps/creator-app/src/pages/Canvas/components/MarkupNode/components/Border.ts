import { css, styled } from '@/hocs/styled';

/**
 * These borders are invisible components that are meant to be placed on top of
 * the Markup Text DraftJS component.
 *
 * When the user drags on these styled-components, it receives a `dragstart` event which is
 * propagated up to the parent component, `<NodeDragTarget>`, firing the parent's
 * `dragstart` handler. This handler is responsible for translating the Markup Text
 * node. This allows us to extend the draggable area of Markup Text for better UX.
 */

const minWidth = 5;
const minHeight = 5;

const baseBorderStyling = css`
  position: absolute;

  background-color: none;

  cursor: grab;
  z-index: 200;

  height: 100%;
  width: 100%;
`;

const LeftBorder = styled.div`
  ${baseBorderStyling}

  left: 0px;
  top: 0px;

  width: ${minWidth}px;
`;

const RightBorder = styled.div`
  ${baseBorderStyling}

  right: 0px;
  top: 0px;

  width: ${minWidth}px;
`;

const TopBorder = styled.div`
  ${baseBorderStyling}

  right: 0px;
  top: 0px;

  height: ${minHeight}px;
`;

const BottomBorder = styled.div`
  ${baseBorderStyling}

  left: 0px;
  bottom: 0px;

  height: ${minHeight}px;
`;

const Border = {
  Left: LeftBorder,
  Right: RightBorder,
  Top: TopBorder,
  Bottom: BottomBorder,
};

export default Border;
