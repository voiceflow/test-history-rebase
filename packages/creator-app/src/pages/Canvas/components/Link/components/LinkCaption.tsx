import * as Realtime from '@voiceflow/realtime-sdk';
import { Box, stopPropagation, useColorPalette } from '@voiceflow/ui';
import React from 'react';

import { LinkEntityContext } from '@/pages/Canvas/contexts';

import { PALETTE_SHADE } from '../constants';
import { InternalLinkInstance } from '../types';
import { migrateColor } from '../utils/colors';
import CaptionInput from './LinkCaptionInput';
import CaptionText from './LinkCaptionText';

interface LinkCaptionProps {
  color: string;
  linkID: string;
  instance: InternalLinkInstance;
  onChange: (caption: Realtime.LinkDataCaption | null) => Promise<void>;
  disabled?: boolean;
  isEditing: boolean;
  isLineActive: boolean;
  onMouseEnter: (event: React.MouseEvent) => void;
  onMouseLeave: (event: React.MouseEvent) => void;
  isHighlighted?: boolean;
  onToggleActive: (event: React.MouseEvent) => void;
  onToggleEditing: (value: unknown) => void;
}

const LinkCaption: React.FC<LinkCaptionProps> = ({
  color: legacyColor,
  instance,
  onChange,
  disabled,
  isEditing,
  isLineActive,
  onMouseEnter,
  onMouseLeave,
  isHighlighted,
  onToggleActive,
  onToggleEditing,
}) => {
  // This next line ensures backwards compatibility
  const color = migrateColor(legacyColor);
  const palette = useColorPalette(color);
  const shade = palette[PALETTE_SHADE];
  const linkEntity = React.useContext(LinkEntityContext)!;

  const captionRect = instance.getCaptionRect();
  const { linkData } = linkEntity.useState((e) => ({ linkData: e.resolve().data }));

  const linkValue = linkData?.caption?.value ?? '';

  return (
    <foreignObject
      ref={instance.captionRef}
      cursor="pointer"
      pointerEvents={disabled ? 'none' : 'all'}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      {...captionRect.current}
    >
      <Box
        ref={instance.captionContainerRef}
        display="inline-block"
        onClick={stopPropagation((event) => (isLineActive ? onToggleEditing(true) : onToggleActive(event)))}
      >
        {isEditing ? (
          <CaptionInput
            value={linkValue}
            color={shade}
            instance={instance}
            onChange={onChange}
            isLineActive={isLineActive}
            isHighlighted={isHighlighted}
            onToggleEditing={onToggleEditing}
          />
        ) : (
          <CaptionText color={shade} isLineActive={isLineActive} isHighlighted={isHighlighted}>
            {linkValue}
          </CaptionText>
        )}
      </Box>
    </foreignObject>
  );
};

export default LinkCaption;
