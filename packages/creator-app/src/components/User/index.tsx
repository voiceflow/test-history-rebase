import { SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { LockOwner } from '@/models';

import { MemberIcon } from './components';
import { MemberIconProps } from './components/MemberIcon';

export * from './components';

type PartialLockOwner = Pick<LockOwner, 'name' | 'color' | 'image'>;

export interface UserProps extends MemberIconProps {
  user?: PartialLockOwner;
  flat?: boolean;
  pending?: boolean;
  className?: string;
}

export const isColorImage = (image: string | undefined): image is string => !!image && image.length === 13 && image.includes('|');

const User = React.forwardRef<HTMLDivElement, UserProps>(({ user, className, pending, ...props }, ref) => {
  // eslint-disable-next-line no-nested-ternary
  const letter = React.useMemo(() => (!user?.image ? '?' : isColorImage(user.image) ? user.name[0] : ''), [user]);

  const styles = React.useMemo(() => {
    const style: React.CSSProperties = {};

    if (!user) {
      return style;
    }

    if (isColorImage(user.image)) {
      const colors = user.color ? user.color.split('|') : user.image.split('|');
      style.backgroundColor = `#${colors[1]}`;
      style.color = `#${colors[0]}`;
    } else if (user) {
      style.fontSize = '0.0009px';
      style.backgroundImage = `url(${user.image})`;
    }

    return style;
  }, [user]);

  if (pending) {
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
});

export default User;
