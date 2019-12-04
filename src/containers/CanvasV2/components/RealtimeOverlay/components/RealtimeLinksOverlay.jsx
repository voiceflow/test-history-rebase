import React from 'react';

import LinkHeadMarker from '@/containers/CanvasV2/components/Link/components/LinkHeadMarker';
import LinkPath from '@/containers/CanvasV2/components/Link/components/LinkPath';
import { buildPath } from '@/containers/CanvasV2/components/Link/utils';
import { OverlayType } from '@/containers/CanvasV2/engine/realtimeEngine';

import AbstractOverlay, { connectOverlay } from './AbstractOverlay';
import LinkOverlaySvg from './RealtimeOverlayLinkPathSvg';

class RealtimeLinksOverlay extends AbstractOverlay {
  linkLocations = {};

  api = {
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

      const [startPoint, endPoint] = linkData.points;
      const nextPoint = [engine.canvas.reverseTransformPoint(startPoint, true), engine.canvas.reverseTransformPoint(endPoint, true)];
      this.linkLocations[tabID] = nextPoint;

      this.animateElement(tabID, (linkEl) => {
        if (!linkEl) return;

        linkEl.setAttribute('d', buildPath(nextPoint));
      });
    },

    removeUser: (tabID) => this.removeLink(tabID),
  };

  constructor(props) {
    super(OverlayType.LINK, props);
  }

  removeLink(tabID) {
    this.linkLocations[tabID] = null;

    this.removeItem(tabID);
  }

  renderItem(tabID, viewer, ref) {
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
