import { useColorPalette } from '@voiceflow/ui';
import React from 'react';

import { css, styled } from '@/hocs/styled';
import { LINK_HIGHLIGHTED_CLASSNAME } from '@/pages/Canvas/constants';

import { HIGHLIGHT_COLOR, PALETTE_SHADE, STROKE_WIDTH } from '../constants';
import { migrateColor } from '../utils/colors';

export interface LinkPathProps extends React.ComponentPropsWithoutRef<'path'> {
  strokeColor?: string;
  isHighlighted?: boolean;
}

const StyledLinkPath = styled.path<LinkPathProps>`
  fill: none;
  stroke: ${({ strokeColor }) => strokeColor};
  stroke-width: ${STROKE_WIDTH}px;

  ${({ isHighlighted }) =>
    isHighlighted &&
    css`
      stroke: ${HIGHLIGHT_COLOR};
    `}

  .${LINK_HIGHLIGHTED_CLASSNAME} && {
    stroke: ${HIGHLIGHT_COLOR};
  }
`;

const LinkPath = React.forwardRef<SVGPathElement, LinkPathProps>((props, ref) => {
  const color = migrateColor(props.strokeColor);
  const palette = useColorPalette(color);

  return (
    <StyledLinkPath ref={ref} {...props} strokeColor={palette[PALETTE_SHADE]} isHighlighted={props.isHighlighted} />
  );
});

export default LinkPath;
