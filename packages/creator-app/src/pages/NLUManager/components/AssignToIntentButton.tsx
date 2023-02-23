import { Button, stopPropagation } from '@voiceflow/ui';
import React from 'react';

export interface AssignToIntentButtonProps extends React.PropsWithChildren {
  onClick?: () => void;
  onHideMenu?: () => void;
  setMenuOpened: (value: boolean) => void;
  menuOpened: boolean;
  isOpen: boolean;
}

const AssignToIntentButton: React.FC<AssignToIntentButtonProps> = ({ children, onClick, onHideMenu, setMenuOpened, menuOpened, isOpen }) => {
  const handleClick = () => {
    if (!onClick) return;
    onClick();
    setMenuOpened(true);
  };

  React.useEffect(() => {
    if (!menuOpened && onHideMenu && isOpen) {
      onHideMenu();
    }
  }, [menuOpened, onHideMenu, isOpen]);

  return (
    <Button squareRadius onClick={stopPropagation(handleClick)} isActive={isOpen}>
      {children || 'Assign to Intent'}
    </Button>
  );
};

export default AssignToIntentButton;
