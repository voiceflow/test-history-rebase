import { System } from '@voiceflow/ui';
import React from 'react';

import TextArea from '@/components/TextArea';

import * as S from './styles';

interface UtteranceInputProps {
  value?: string;
  onDelete: () => void;
  onRename: (newName: string) => void;
}

const MAX_SYMBOLS = 130;
const MAX_ROWS = 4;

const UtteranceInput: React.FC<UtteranceInputProps> = ({ value = '', onRename, onDelete }) => {
  const [utteranceValue, setUtteranceValue] = React.useState(value);
  const [isFocused, setIsFocused] = React.useState(false);

  const placeholder = React.useMemo(() => {
    if (utteranceValue.replace(/\s/g, '').length > MAX_SYMBOLS) {
      return `${utteranceValue.substring(0, MAX_SYMBOLS)}...`;
    }

    return utteranceValue;
  }, [utteranceValue]);

  const handleTextAreBlur = () => {
    setIsFocused(false);
    if (utteranceValue === value) return;
    onRename(utteranceValue);
  };

  React.useEffect(() => setUtteranceValue(value), [value]);

  return (
    <S.UtteranceRow>
      <TextArea
        value={isFocused ? utteranceValue : placeholder}
        onBlur={handleTextAreBlur}
        onFocus={() => setIsFocused(true)}
        maxRows={MAX_ROWS}
        onChangeText={setUtteranceValue}
      />

      <System.IconButtonsGroup.Horizontal>
        <System.IconButton.Base icon="minus" onClick={onDelete} />
      </System.IconButtonsGroup.Horizontal>
    </S.UtteranceRow>
  );
};

export default UtteranceInput;
