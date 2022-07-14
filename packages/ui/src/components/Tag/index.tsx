import React from 'react';

import { useColorPalette } from '../ColorPicker/hooks';
import { Label, TagWrapper } from './styles';

interface TagProps {
  color?: string;
  children: string;
  className?: string;
  isVariable?: boolean;
  onClick?: React.MouseEventHandler<HTMLSpanElement>;
  onMouseDown?: React.MouseEventHandler<HTMLSpanElement>;
}

export const Tag = React.forwardRef<HTMLSpanElement, React.PropsWithChildren<TagProps>>(
  ({ color, onClick, children, className, ...props }, ref): React.ReactElement => {
    const palette = useColorPalette(color);
    const noColor = !color;

    return (
      <TagWrapper onClick={onClick} noColor={noColor} ref={ref} {...props} className={className} palette={palette}>
        <Label noColor={noColor} palette={palette}>
          {children}
        </Label>
      </TagWrapper>
    );
  }
);
