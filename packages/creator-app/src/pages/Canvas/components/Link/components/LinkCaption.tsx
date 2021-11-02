import { Box, stopPropagation } from '@voiceflow/ui';
import React from 'react';

import { LinkDataCaption } from '@/models';
import { LinkEntityContext } from '@/pages/Canvas/contexts';

import { InternalLinkInstance } from '../types';
import CaptionInput from './LinkCaptionInput';
import CaptionText from './LinkCaptionText';

interface LinkCaptionProps {
  color: string;
  linkID: string;
  instance: InternalLinkInstance;
  onChange: (caption: LinkDataCaption | null) => Promise<void>;
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
  color,
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
            color={color}
            instance={instance}
            onChange={onChange}
            isLineActive={isLineActive}
            isHighlighted={isHighlighted}
            onToggleEditing={onToggleEditing}
          />
        ) : (
          <CaptionText color={color} isLineActive={isLineActive} isHighlighted={isHighlighted}>
            {linkValue}
          </CaptionText>
        )}
      </Box>
    </foreignObject>
  );
};

export default LinkCaption;
