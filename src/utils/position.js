// SOURCE: https://www.npmjs.com/package/react-overlay-popup

/*
 * vp - Target Left/Top
 * lp - Target Width/Height
 * lc - Element Width/height
 * kp - Target X/Y
 * kc - Element X/Y
 * vm - Window Width/Height
 * Δv - Gap
 */

export const strategies = {};

export function createStrategyFromFunction(positionFunc) {
  return function(parent, child, options) {
    const position = positionFunc(parent, child, options);
    setPosition(child, position.left, position.top);
  };
}

// eslint-disable-next-line max-params
function calculate(vp, lp, lc, kp, kc, Δv) {
  return vp + kp * lp - kc * lc + Δv;
}

// eslint-disable-next-line max-params
function calculateWithFallback(vp, lp, lc, kp, kc, vm, Δv) {
  const primary = kp !== kc;
  const vc = calculate(vp, lp, lc, kp, kc, Δv);

  if (primary) {
    if ((kp > 0.5 && vc + lc > vm) || (kp < 0.5 && vc < 0)) {
      const position = calculate(vp, lp, lc, 1 - kp, 1 - kc, -Δv);

      return position < 0 ? vc : position;
    }
    return vc;
  }
  if (vc < 0) {
    return calculate(vp, lp, lc, 0, 0, Δv);
  }
  if (vc + lc > vm) {
    return calculate(vp, lp, lc, 1, 1, Δv);
  }
  return vc;
}

// eslint-disable-next-line max-params
function createStrategy(parentX, childX, parentY, childY, gapX, gapY) {
  return function(parent, child, options) {
    const parentRect = parent.getBoundingClientRect();
    const childWidth = child.offsetWidth;
    const childHeight = child.offsetHeight;

    const left = calculateWithFallback(parentRect.left, parentRect.width, childWidth, parentX, childX, window.innerWidth, gapX * options.gap);
    const top = calculateWithFallback(parentRect.top, parentRect.height, childHeight, parentY, childY, window.innerHeight, gapY * options.gap);

    setPosition(child, left, top);
  };
}

function setPosition(child, rawLeft, rawTop) {
  const left = Math.round(rawLeft);
  const top = Math.round(rawTop);

  child.style.left = `${left}px`;
  child.style.top = `${top}px`;
  child.style.position = 'absolute';
}

strategies['top left'] = createStrategy(0, 0, 0, 1, 0, -1);
strategies.top = createStrategy(0.5, 0.5, 0, 1, 0, -1);
strategies['top center'] = strategies.top;
strategies['top right'] = createStrategy(1, 1, 0, 1, 0, -1);

strategies['bottom left'] = createStrategy(0, 0, 1, 0, 0, 1);
strategies.bottom = createStrategy(0.5, 0.5, 1, 0, 0, 1);
strategies['bottom center'] = strategies.bottom;
strategies['bottom right'] = createStrategy(1, 1, 1, 0, 0, 1);

strategies['left top'] = createStrategy(0, 1, 0, 0, -1, 0);
strategies.left = createStrategy(0, 1, 0.5, 0.5, -1, 0);
strategies['left center'] = strategies.left;
strategies['left bottom'] = createStrategy(0, 1, 1, 1, -1, 0);

strategies['right top'] = createStrategy(1, 0, 0, 0, 1, 0);
strategies.right = createStrategy(1, 0, 0.5, 0.5, 1, 0);
strategies['right center'] = strategies.right;
strategies['right bottom'] = createStrategy(1, 0, 1, 1, 1, 0);
