import React from 'react';

import * as S from '../styles';

interface UtterancePreviewProps {
  text: string;
  utteranceWidth: number;
}

const ITEM_WIDTH = 40;

const UtterancePreview: React.FC<UtterancePreviewProps> = ({ text, utteranceWidth }) => {
  return (
    <div style={{ width: utteranceWidth - ITEM_WIDTH }}>
      <S.Utterance isDragging isDraggingPreview>
        {text}
      </S.Utterance>
    </div>
  );
};

export default React.memo(UtterancePreview);
