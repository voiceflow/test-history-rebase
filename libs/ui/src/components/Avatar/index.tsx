import React from 'react';

import * as S from './styles';

export interface AvatarProps extends S.ContainerProps {
  text: string;
  color?: string;
  image: string | null;
  className?: string;
  small?: boolean;
  squareRadius?: boolean;
}

const getCircleStyles = (image: string | null, color?: string) => {
  const style: React.CSSProperties = {};
  if (isColorImage(image)) {
    const colors = color?.split('|') || image.split('|');

    style.color = `#${colors[0]}`;
    style.backgroundColor = `#${colors[1]}`;
  } else if (image) {
    style.backgroundImage = `url(${image})`;
  } else {
    style.color = '#4E8BBD';
    style.backgroundColor = '#d4e6f5';
  }

  return style;
};

export const isColorImage = (image: string | null): image is string => image?.length === 13 && image.includes('|');

const Avatar: React.ForwardRefRenderFunction<HTMLDivElement, AvatarProps> = (
  { image, text, color, className, ...props },
  ref
) => {
  const styles = React.useMemo(() => getCircleStyles(image, color), [image, color]);

  return (
    <S.Container className={className} style={styles} ref={ref} {...props}>
      {!styles.backgroundImage && (text[0] ?? '')}
    </S.Container>
  );
};

export default React.forwardRef<HTMLDivElement, AvatarProps>(Avatar);
