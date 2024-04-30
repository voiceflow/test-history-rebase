import React from 'react';

import { useOnScreen } from '@/hooks';

export interface StickyProps {
  top?: number;
  disabled?: boolean;
  children: (props: { top?: number; sticked: boolean }) => React.ReactNode;
  initialSticked?: boolean;
}

const Sticky: React.FC<StickyProps> = ({ top, children, disabled, initialSticked }) => {
  const visibilityNodeRef = React.useRef<HTMLDivElement>(null);

  const isOnScreen = useOnScreen(visibilityNodeRef, { disabled, initialState: initialSticked });

  return (
    <>
      {!disabled && <div style={top ? { position: 'relative', top: `${-top}px` } : {}} ref={visibilityNodeRef} />}

      {children({ top, sticked: !isOnScreen })}
    </>
  );
};

export default Sticky;
