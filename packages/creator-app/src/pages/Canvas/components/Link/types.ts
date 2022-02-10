import { BaseModels } from '@voiceflow/base-types';
import { Nullable } from '@voiceflow/common';
import React from 'react';

import { LinkInstance } from '@/pages/Canvas/engine/entities/linkEntity';
import { Point } from '@/types';

import { MarkerAttrs } from './utils';

export type InternalLinkInstance = LinkInstance & {
  pathRef: React.RefObject<SVGPathElement>;
  markerRef: React.RefObject<SVGMarkerElement>;
  captionRef: React.RefObject<SVGForeignObjectElement>;
  settingsRef: React.RefObject<{ setPosition: () => void }>;
  containerRef: React.RefObject<SVGGElement>;
  hiddenPathRef: React.RefObject<SVGPathElement>;
  captionContainerRef: React.RefObject<HTMLDivElement>;

  getCenter: () => React.MutableRefObject<Point | null>;
  isStraight: () => boolean;
  getLinkType: () => BaseModels.Project.LinkType;
  getLinkColor: () => string;
  getCaptionRect: () => React.MutableRefObject<{ x: number; y: number; width: number; height: number }>;

  updateMarkerPosition: () => void;
  updateCaptionPosition: () => void;

  /**
   * get the link's SVG path string
   */
  getPath: () => Nullable<string>;

  /**
   * get head marker attrs (orient and refX)
   */
  getMarkerAttrs: () => Nullable<MarkerAttrs>;
};
