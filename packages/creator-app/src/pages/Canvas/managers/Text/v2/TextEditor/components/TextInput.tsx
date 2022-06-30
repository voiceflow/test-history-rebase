import { BaseNode } from '@voiceflow/base-types';
import { Divider } from '@voiceflow/ui';
import React from 'react';

import { SlateTextInput, TOOLBAR_ICONS_V2 } from '@/components/SlateInputs';
import MessageDelayButton from '@/pages/Canvas/components/TextListItem/components/MessageDelayButton';

interface TextInputProps {
  data: BaseNode.Text.TextData;
  onUpdate: (newText: Partial<BaseNode.Text.TextData>) => void;
  isNew: boolean;
}

const TextInput: React.FC<TextInputProps> = ({ data, onUpdate, isNew }) => {
  return (
    <SlateTextInput
      value={data.content}
      onBlur={(value) => onUpdate({ content: value })}
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus={isNew}
      icons={TOOLBAR_ICONS_V2}
      extraToolbarButtons={
        <>
          <Divider isVertical height="15px" style={{ margin: 0 }} />
          <MessageDelayButton icon={TOOLBAR_ICONS_V2.DELAY} data={data} onUpdate={(value: Partial<BaseNode.Text.TextData>) => onUpdate(value)} />
        </>
      }
    />
  );
};

export default TextInput;
