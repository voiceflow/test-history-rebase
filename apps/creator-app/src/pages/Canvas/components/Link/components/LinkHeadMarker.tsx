import { useColorPalette } from '@voiceflow/ui';
import React from 'react';

import { HIGHLIGHT_COLOR, PALETTE_SHADE, STROKE_DEFAULT_COLOR } from '../constants';
import { migrateColor } from '../utils/colors';

export interface LinkHeadMarkerProps {
  id?: string;
  refX?: string;
  color?: string;
  orient?: string;
  isHighlighted?: boolean;
  blockViaLinkMode?: boolean;
}

const LinkHeadMarker: React.ForwardRefRenderFunction<SVGMarkerElement, LinkHeadMarkerProps> = (
  { id, refX = '8', orient, isHighlighted, blockViaLinkMode, color: legacyColor = STROKE_DEFAULT_COLOR },
  ref
) => {
  // This next line ensures backwards compatibility
  const color = migrateColor(legacyColor);
  const palette = useColorPalette(color);

  const blockViaLinkRefX = orient === '0deg' ? '2' : '8';

  return (
    <marker
      id={id ? `head-${id}` : 'head'}
      ref={ref}
      refX={blockViaLinkMode ? blockViaLinkRefX : refX}
      refY={blockViaLinkMode ? '8' : '4'}
      orient={orient}
      viewBox={blockViaLinkMode ? '0 0 16 16' : '0 0 20 20'}
      markerUnits="userSpaceOnUse"
      markerWidth={blockViaLinkMode ? '16' : '20'}
      markerHeight={blockViaLinkMode ? '16' : '20'}
    >
      {blockViaLinkMode ? (
        <path
          d="M14.16 8.84H9.12a.28.28 0 0 0-.28.28v5.04a.84.84 0 0 1-1.68 0V9.12a.28.28 0 0 0-.28-.28H1.84a.84.84 0 0 1 0-1.68h5.04a.28.28 0 0 0 .28-.28V1.84a.84.84 0 0 1 1.68 0v5.04c0 .155.125.28.28.28h5.04a.84.84 0 0 1 0 1.68z"
          fill={isHighlighted ? HIGHLIGHT_COLOR : palette[PALETTE_SHADE]}
        ></path>
      ) : (
        <path
          d="M7.07138888,5.50174526 L2.43017246,7.82235347 C1.60067988,8.23709976 0.592024983,7.90088146 0.177278692,7.07138888 C0.0606951226,6.83822174 0,6.58111307 0,6.32042429 L0,1.67920787 C0,0.751806973 0.751806973,0 1.67920787,0 C1.93989666,0 2.19700532,0.0606951226 2.43017246,0.177278692 L7,3 C7.82949258,3.41474629 8.23709976,3.92128809 7.82235347,4.75078067 C7.6598671,5.07575341 7.39636161,5.33925889 7.07138888,5.50174526 Z"
          fill={isHighlighted ? HIGHLIGHT_COLOR : palette[PALETTE_SHADE]}
        ></path>
      )}
    </marker>
  );
};

export default React.forwardRef(LinkHeadMarker);
