/* eslint
   no-mixed-operators: off
*/
import { isSafari, isFirefox } from './BrowserDetector';
import MonotonicInterpolant from './MonotonicInterpolant';

const ELEMENT_NODE = 1;

export function getNodeClientOffset(node) {
  const el = node.nodeType === ELEMENT_NODE ?
    node :
    node.parentElement;

  if (!el) {
    return null;
  }

  const { top, left } = el.getBoundingClientRect();
  return { x: left, y: top };
}

export function getEventClientOffset(e) {
  return {
    x: e.clientX,
    y: e.clientY,
  };
}

export function getDragPreviewOffset(sourceNode, dragPreview, clientOffset, anchorPoint) {
  // The browsers will use the image intrinsic size under different conditions.
  // Firefox only cares if it's an image, but WebKit also wants it to be detached.
  const dragPreviewNode = dragPreview;

  const dragPreviewNodeOffsetFromClient = getNodeClientOffset(dragPreviewNode);
  const offsetFromDragPreview = {
    x: clientOffset.x - dragPreviewNodeOffsetFromClient.x,
    y: clientOffset.y - dragPreviewNodeOffsetFromClient.y,
  };

  const { offsetWidth: sourceWidth, offsetHeight: sourceHeight } = sourceNode;
  const { anchorX, anchorY } = anchorPoint;

  let dragPreviewWidth = sourceWidth;
  let dragPreviewHeight = sourceHeight;

  // Work around @2x coordinate discrepancies in browsers
 if (isFirefox()) {
    dragPreviewHeight *= window.devicePixelRatio;
    dragPreviewWidth *= window.devicePixelRatio;
  }

  // Interpolate coordinates depending on anchor point
  // If you know a simpler way to do this, let me know
  const interpolantX = new MonotonicInterpolant([0, 0.5, 1], [
    // Dock to the left
    offsetFromDragPreview.x,
    // Align at the center
    (offsetFromDragPreview.x / sourceWidth) * dragPreviewWidth,
    // Dock to the right
    offsetFromDragPreview.x + dragPreviewWidth - sourceWidth,
  ]);
  const interpolantY = new MonotonicInterpolant([0, 0.5, 1], [
    // Dock to the top
    offsetFromDragPreview.y,
    // Align at the center
    (offsetFromDragPreview.y / sourceHeight) * dragPreviewHeight,
    // Dock to the bottom
    offsetFromDragPreview.y + dragPreviewHeight - sourceHeight,
  ]);
  const x = interpolantX.interpolate(anchorX);
  let y = interpolantY.interpolate(anchorY);

  return { x, y };
}