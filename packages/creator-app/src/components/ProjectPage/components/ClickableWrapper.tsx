import React from 'react';

interface ClickableWrapperProps {
  onClick: VoidFunction;
}

export const ClickableWrapper: React.FC<ClickableWrapperProps> = ({ children, onClick }) => {
  return (
    <div onClick={onClick} aria-hidden="true">
      {children}
    </div>
  );
};
