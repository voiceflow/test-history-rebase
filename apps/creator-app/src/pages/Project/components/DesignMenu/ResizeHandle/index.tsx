import { Portal } from '@voiceflow/ui';
import React from 'react';

import * as S from './styles';

interface DesignMenuResizeHandleProps {
  onMouseDown: (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  isOpen?: boolean;
  onClick: VoidFunction;
}

const DesignMenuResizeHandle: React.FC<DesignMenuResizeHandleProps> = ({ onMouseDown, onClick, isOpen }) => {
  const button = <S.CollapseButton isOpen={!!isOpen} icon="arrowLeftSmall" onClick={onClick} />;

  return <S.Container onMouseDown={onMouseDown}>{isOpen ? button : <Portal>{button}</Portal>}</S.Container>;
};

export default DesignMenuResizeHandle;
