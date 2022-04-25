import React from 'react';

import { useColorPalette } from '../ColorPicker/hooks';
import { Label, TagWrapper } from './styles';

interface TagProps {
  color?: string;
  children: string;
  className?: string;
}

// eslint-disable-next-line import/prefer-default-export
export const Tag = React.forwardRef<HTMLSpanElement, React.PropsWithChildren<TagProps>>(
  ({ color, children, className, ...props }, ref): React.ReactElement => {
    const palette = useColorPalette(color);
    const noColor = !color;

    return (
      <TagWrapper noColor={noColor} ref={ref} {...props} className={className} palette={palette}>
        <Label noColor={noColor} palette={palette}>
          {children}
        </Label>
      </TagWrapper>
    );
  }
);
