import React from 'react';

import { LinkInstance } from '@/pages/Canvas/engine/entities/linkEntity';
import { Point } from '@/types';

export type InternalLinkInstance = LinkInstance & {
  containerRef: React.RefObject<SVGGElement>;
  pathRef: React.RefObject<SVGPathElement>;
  hiddenPathRef: React.RefObject<SVGPathElement>;

  /**
   * get the link's SVG path string
   */
  getPath: () => string | null;

  /**
   * get the center point of the rendered link
   */
  getCenter: () => Point | null;
};
