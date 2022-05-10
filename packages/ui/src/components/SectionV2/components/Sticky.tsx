import { useOnScreen } from '@ui/hooks';
import React from 'react';

export interface StickyProps {
  disabled?: boolean;
  children: (props: { sticked: boolean }) => React.ReactNode;
  initialSticked?: boolean;
}

const Sticky: React.FC<StickyProps> = ({ children, disabled, initialSticked }) => {
  const visibilityNodeRef = React.useRef<HTMLDivElement>(null);

  const isOnScreen = useOnScreen(visibilityNodeRef, { disabled, initialState: initialSticked });

  return (
    <>
      {!disabled && <div ref={visibilityNodeRef} />}

      {children({ sticked: !isOnScreen })}
    </>
  );
};

export default Sticky;
