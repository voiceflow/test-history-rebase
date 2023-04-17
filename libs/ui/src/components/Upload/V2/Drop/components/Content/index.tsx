import React from 'react';

import * as S from './styles';

export interface UploadContentProps {
  value: string;
  onRemove: () => void;
}

const UploadContent: React.FC<UploadContentProps> = ({ value, onRemove }) => {
  return (
    <S.Container>
      <S.CornerActionButton onClick={onRemove} size={14} icon="close" />
      <S.StatusButton size={16} icon="checkSquare" />
      {value.substring(value.indexOf('-') + 1)}
    </S.Container>
  );
};

export default UploadContent;
