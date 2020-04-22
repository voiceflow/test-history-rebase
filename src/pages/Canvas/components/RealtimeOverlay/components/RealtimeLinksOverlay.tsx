import React from 'react';

import LinkHeadMarker from '@/pages/Canvas/components/Link/components/LinkHeadMarker';
import LinkPath from '@/pages/Canvas/components/Link/components/LinkPath';
import { buildPath } from '@/pages/Canvas/components/Link/utils';
import { OverlayType } from '@/pages/Canvas/constants';
import { RealtimeLinkOverlayAPI } from '@/pages/Canvas/types';
import { Pair, Point } from '@/types';

import AbstractOverlay, { ConnectedRealtimeOverlayProps, RealtimeViewer, connectOverlay } from './AbstractOverlay';
import LinkOverlaySvg from './RealtimeOverlayLinkPathSvg';

class RealtimeLinksOverlay extends AbstractOverlay<RealtimeLinkOverlayAPI> {
  linkLocations: Record<string, Pair<Point> | null> = {};

  api: RealtimeLinkOverlayAPI = {
    moveLink: (tabID, linkData) => {
      /**
       * linkData:
       * {
       *   points: [[startX, startY], [endX, endY]],
       *   reset: bool,
       * }
       */
      const { engine } = this.props;

      if (linkData.reset) {
        this.removeItem(tabID);
        return;
      }

      const [startPoint, endPoint] = (linkData as { points: Pair<Point> }).points;
      const nextPoint: Pair<Point> = [engine.canvas!.reverseTransformPoint(startPoint, true), engine.canvas!.reverseTransformPoint(endPoint, true)];
      this.linkLocations[tabID] = nextPoint;

      this.animateElement(tabID, (linkEl) => {
        if (!linkEl) return;

        linkEl.setAttribute('d', buildPath(nextPoint));
      });
    },

    removeUser: (tabID) => this.removeLink(tabID),
  };

  constructor(props: ConnectedRealtimeOverlayProps) {
    super(OverlayType.LINK, props);
  }

  removeLink(tabID: string) {
    this.linkLocations[tabID] = null;

    this.removeItem(tabID);
  }

  renderItem(tabID: string, viewer: RealtimeViewer, ref: React.RefObject<SVGPathElement>) {
    const linkLocation = this.linkLocations[tabID];

    if (!linkLocation) return null;

    const strokeColor = viewer.color.includes('|') ? `#${viewer.color.split('|')[0]}` : '#f8758f';
    const path = buildPath(linkLocation);

    return (
      <LinkOverlaySvg key={tabID}>
        <defs>
          <LinkHeadMarker id={tabID} color={strokeColor} />
        </defs>
        <LinkPath ref={ref} strokeColor={strokeColor} d={path} isHovering markerEnd={`url(#head-${tabID})`} />
      </LinkOverlaySvg>
    );
  }
}

export default connectOverlay(RealtimeLinksOverlay);
