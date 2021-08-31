import { Box, useDidUpdateEffect, usePersistFunction, useTeardown } from '@voiceflow/ui';
import React from 'react';

import { EditableTextAPI } from '@/components/EditableText';
import { LinkDataCaption } from '@/models';
import { LinkEntityContext } from '@/pages/Canvas/contexts';
import { withEnterPress } from '@/utils/dom';

import { InternalLinkInstance } from '../types';
import { getPathPointsCenter } from '../utils';
import CaptionInput from './LinkCaptionInput';

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
  const textRef = React.useRef<EditableTextAPI | null>(null);
  const savedRef = React.useRef(false);
  const linkEntity = React.useContext(LinkEntityContext)!;

  const center = instance.getCenter();
  const points = instance.getPoints();
  const captionRect = instance.getCaptionRect();
  const { linkData } = linkEntity.useState((e) => ({ linkData: e.resolve().data }));

  const linkValue = linkData?.caption?.value ?? '';
  const [value, setValue] = React.useState(linkValue);

  const onFocus = () => {
    if (!isEditing) {
      onToggleEditing(true);
    }
  };

  const onSave = async () => {
    await onChange(
      !value ? null : { value, width: instance.captionContainerRef.current!.clientWidth, height: instance.captionContainerRef.current!.clientHeight }
    );

    savedRef.current = true;
  };

  const onEnterPress = async () => {
    await onSave();

    onToggleEditing(false);
  };

  const onAutosize = () => {
    if (instance.captionContainerRef.current && center.current) {
      const width = instance.captionContainerRef.current.clientWidth;
      const height = instance.captionContainerRef.current.clientHeight;

      captionRect.current = {
        x: center.current[0] - width / 2,
        y: center.current[1] - height / 2,
        width,
        height,
      };

      instance.updateCaptionPosition();
    }
  };

  React.useEffect(() => {
    if (isEditing) {
      if (!linkData?.caption) {
        center.current = getPathPointsCenter(points.current!, { straight: instance.isStraight() });
      }

      setValue(linkValue);
      textRef.current?.startEditing();
    } else {
      textRef.current?.stopEditing();
    }
  }, [isEditing]);

  useDidUpdateEffect(() => {
    if (linkValue !== value) {
      setValue(linkValue);
    }
  }, [linkValue]);

  const persistedSave = usePersistFunction(onSave);

  useTeardown(() => {
    if (!savedRef.current) {
      persistedSave();
    }
  });

  return (
    <foreignObject
      ref={instance.captionRef}
      cursor="pointer"
      pointerEvents={disabled ? 'none' : 'all'}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      {...captionRect.current}
    >
      <Box display="inline-block" ref={instance.captionContainerRef} onClick={isLineActive ? undefined : onToggleActive}>
        <CaptionInput
          ref={textRef}
          value={value}
          color={color}
          onBlur={onSave}
          onFocus={onFocus}
          onChange={setValue}
          onAutosize={onAutosize}
          onKeyPress={withEnterPress(onEnterPress)}
          placeholder="Type something"
          isLineActive={isLineActive}
          isHighlighted={isHighlighted}
        />
      </Box>
    </foreignObject>
  );
};

export default LinkCaption;
