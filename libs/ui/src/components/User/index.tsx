import React from 'react';

import SvgIcon from '@/components/SvgIcon';

import { MemberIcon } from './components';
import type { MemberIconProps } from './components/MemberIcon';

export * from './components';

export interface UserData {
  name: string | null;
  image?: string | null;
  color?: string | null;
  creator_id: number | null;
}

export interface UserProps extends MemberIconProps {
  user: UserData;
  flat?: boolean;
  pending?: boolean;
  className?: string;
  small?: boolean;
  square?: boolean;
}

export const isColorImage = (image?: string | null): image is string => image?.length === 13 && image.includes('|');

const User: React.ForwardRefRenderFunction<HTMLDivElement, UserProps> = ({ user, className, ...props }, ref) => {
  const letter = React.useMemo(() => {
    if (!user.image) return '?';

    return (isColorImage(user.image) && user.name?.[0]) || '';
  }, [user]);

  const styles = React.useMemo(() => {
    const style: React.CSSProperties = {};

    if (isColorImage(user.image)) {
      const colors = user.color ? user.color.split('|') : user.image.split('|');

      style.color = `#${colors[0]}`;
      style.backgroundColor = `#${colors[1]}`;
    } else if (user.image) {
      style.fontSize = '0.0009px';
      style.backgroundImage = `url(${user.image})`;
    }

    return style;
  }, [user]);

  if (!user.creator_id) {
    return (
      <MemberIcon className={className} ref={ref} {...props}>
        <SvgIcon icon="clock" size={12} />
      </MemberIcon>
    );
  }

  return (
    <MemberIcon className={className} style={styles} ref={ref} {...props}>
      {letter}
    </MemberIcon>
  );
};

export default React.forwardRef<HTMLDivElement, UserProps>(User);
