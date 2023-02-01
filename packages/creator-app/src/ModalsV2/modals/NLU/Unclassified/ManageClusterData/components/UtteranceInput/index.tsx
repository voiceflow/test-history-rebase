import { Input, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import * as S from './styles';

interface UtteranceInputProps {
  value?: string;
  onDelete: () => void;
  onRename: (newName: string) => void;
}

const UtteranceInput: React.FC<UtteranceInputProps> = ({ value = '', onRename, onDelete }) => {
  const [utteranceValue, setUtteranceValue] = React.useState(value);

  React.useEffect(() => setUtteranceValue(value), [value]);

  return (
    <S.UtteranceRow>
      <Input
        value={utteranceValue}
        onChange={(event) => event.target.value && setUtteranceValue(event.target.value)}
        onBlur={() => utteranceValue !== value && onRename(utteranceValue)}
      />

      <SvgIcon icon="minus" color={SvgIcon.DEFAULT_COLOR} clickable onClick={onDelete} />
    </S.UtteranceRow>
  );
};

export default UtteranceInput;
