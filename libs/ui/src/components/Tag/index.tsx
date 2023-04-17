import React from 'react';

import { useColorPalette } from '../ColorPicker/hooks';
import * as S from './styles';

interface TagProps {
  color?: string;
  onClick?: React.MouseEventHandler<HTMLSpanElement>;
  className?: string;
  isVariable?: boolean;
  noBrackets?: boolean;
  onMouseDown?: React.MouseEventHandler<HTMLSpanElement>;
}

const Tag = React.forwardRef<HTMLSpanElement, React.PropsWithChildren<TagProps>>(
  ({ color, onClick, children, className, ...props }, ref): React.ReactElement => {
    const palette = useColorPalette(color);
    const noColor = !color;

    return (
      <S.Container onClick={onClick} noColor={noColor} ref={ref} {...props} className={className} palette={palette}>
        <S.Label noColor={noColor} palette={palette}>
          {children}
        </S.Label>
      </S.Container>
    );
  }
);

export default Tag;
