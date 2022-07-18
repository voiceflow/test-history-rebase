import { Portal } from '@voiceflow/ui';
import React from 'react';

import * as S from './styles';

interface DesignMenuV2ResizeHandleProps {
  onMouseDown: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  isOpen?: boolean;
  onClick: VoidFunction;
}

const DesignMenuV2ResizeHandle: React.FC<DesignMenuV2ResizeHandleProps> = ({ onMouseDown, onClick, isOpen }) => {
  const button = <S.CollapseButton isOpen={!!isOpen} icon="arrowLeftSmall" onClick={onClick} />;

  return <S.Container onMouseDown={onMouseDown}>{isOpen ? button : <Portal>{button}</Portal>}</S.Container>;
};

export default DesignMenuV2ResizeHandle;
