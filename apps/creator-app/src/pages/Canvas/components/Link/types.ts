import type { BaseModels } from '@voiceflow/base-types';
import type { Nullable } from '@voiceflow/common';
import type React from 'react';

import type { LinkInstance } from '@/pages/Canvas/engine/entities/linkEntity';
import type { Point } from '@/types';

import type { LinkedRects, MarkerAttrs } from './utils';

export type InternalLinkInstance = LinkInstance & {
  pathRef: React.RefObject<SVGPathElement>;
  cacheRef: React.MutableRefObject<{
    isStraight: boolean;
    isPathLocked: boolean;
    sourceNodeIsChip: boolean;
    sourceNodeIsStart: boolean;
    sourceNodeIsAction: boolean;
    targetNodeIsCombined: boolean;
  }>;
  markerRef: React.RefObject<SVGMarkerElement>;
  captionRef: React.RefObject<SVGForeignObjectElement>;
  settingsRef: React.RefObject<{ setPosition: VoidFunction }>;
  containerRef: React.RefObject<SVGGElement>;
  hiddenPathRef: React.RefObject<SVGPathElement>;
  linkedRectsRef: React.MutableRefObject<LinkedRects | null>;
  captionContainerRef: React.RefObject<HTMLDivElement>;

  getCenter: () => React.MutableRefObject<Point | null>;
  isStraight: () => boolean;
  getLinkType: () => BaseModels.Project.LinkType;
  getLinkColor: () => string;
  getCaptionRect: () => React.MutableRefObject<{ x: number; y: number; width: number; height: number }>;
  onLinkPositionReversed: (options: { isSource: boolean; sourceAndTargetSelected: boolean }) => void;

  redraw: VoidFunction;
  updateCaptionPosition: VoidFunction;

  /**
   * get the link's SVG path string
   */
  getPath: () => Nullable<string>;

  /**
   * get head marker attrs (orient and refX)
   */
  getMarkerAttrs: () => Nullable<MarkerAttrs>;
};
