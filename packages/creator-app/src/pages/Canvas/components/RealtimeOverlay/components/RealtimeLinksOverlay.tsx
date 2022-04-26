import moize from 'moize';
import React from 'react';

import { buildHeadMarker, buildPath, getPathPoints, HeadMarker, Path } from '@/pages/Canvas/components/Link';
import { OverlayType } from '@/pages/Canvas/constants';
import { RealtimeLinkOverlayAPI } from '@/pages/Canvas/types';
import { Pair, Point } from '@/types';

import AbstractOverlay, { ConnectedRealtimeOverlayProps, connectOverlay, RealtimeViewer } from './AbstractOverlay';
import LinkOverlaySvg from './RealtimeOverlayLinkPathSvg';

const DEFAULT_STROKE_COLOR = '#f8758f';
class RealtimeLinksOverlay extends AbstractOverlay<RealtimeLinkOverlayAPI> {
  linkLocations: Record<string, Pair<Point> | null> = {};

  api: RealtimeLinkOverlayAPI = {
    moveLink: (tabID, linkData) => {
      const { engine } = this.props;

      if (!engine.canvas) return;

      if (linkData.reset) {
        this.removeItem(tabID);
        return;
      }

      const [startPoint, endPoint] = linkData.points;
      const nextPoint: Pair<Point> = [engine.canvas.reverseTransformPoint(startPoint, true), engine.canvas.reverseTransformPoint(endPoint, true)];
      this.linkLocations[tabID] = nextPoint;

      this.animateElement(tabID, (linkEl) => {
        if (!linkEl) return;

        const isStraight = engine.isStraightLinks();

        const path = buildPath(getPathPoints(nextPoint, { straight: isStraight }), { isStraight });

        linkEl.setAttribute('d', path);
      });
    },

    removeUser: (tabID) => this.removeLink(tabID),
  };

  constructor(props: ConnectedRealtimeOverlayProps) {
    super(OverlayType.LINK, props);
  }

  buildMoizedPath = moize.simple((points: Pair<Point> | null) => {
    const isStraight = this.props.engine.isStraightLinks();

    return buildPath(getPathPoints(points, { straight: isStraight }), { isStraight });
  });

  removeLink(tabID: string) {
    this.linkLocations[tabID] = null;

    this.removeItem(tabID);
  }

  renderItem(tabID: string, viewer: RealtimeViewer, ref: React.RefObject<SVGPathElement>) {
    const linkLocation = this.linkLocations[tabID];

    if (!linkLocation) return null;

    const strokeColor = viewer.color.includes('|') ? `#${viewer.color.split('|')[0]}` : DEFAULT_STROKE_COLOR;
    const path = this.buildMoizedPath(linkLocation);

    return (
      <LinkOverlaySvg key={tabID}>
        <defs>
          <HeadMarker id={tabID} color={strokeColor} />
        </defs>

        <Path ref={ref} strokeColor={strokeColor} d={path} markerEnd={buildHeadMarker(tabID)} />
      </LinkOverlaySvg>
    );
  }
}

export default connectOverlay(RealtimeLinksOverlay);
