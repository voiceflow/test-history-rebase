import React from 'react';

import { LinkInstance } from '@/pages/Canvas/engine/entities/linkEntity';
import { Point } from '@/types';

import { MarkerAttrs } from './utils';

export type InternalLinkInstance = LinkInstance & {
  containerRef: React.RefObject<SVGGElement>;
  pathRef: React.RefObject<SVGPathElement>;
  markerRef: React.RefObject<SVGMarkerElement>;
  hiddenPathRef: React.RefObject<SVGPathElement>;

  /**
   * get the link's SVG path string
   */
  getPath: () => string | null;

  /**
   * get the center point of the rendered link
   */
  getCenter: () => Point | null;

  /**
   * get head marker attrs (orient and refX)
   */
  getMarkerAttrs: () => MarkerAttrs | null;
};
