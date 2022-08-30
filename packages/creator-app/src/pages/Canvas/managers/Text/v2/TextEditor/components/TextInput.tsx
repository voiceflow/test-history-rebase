import { BaseNode } from '@voiceflow/base-types';
import { Divider } from '@voiceflow/ui';
import React from 'react';

import { SlateTextInput, TOOLBAR_ICONS } from '@/components/SlateInputs';
import MessageDelayButton from '@/pages/Canvas/components/TextListItem/components/MessageDelayButton';

interface TextInputProps {
  data: BaseNode.Text.TextData;
  onUpdate: (newText: Partial<BaseNode.Text.TextData>) => void;
  autofocus?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({ data, onUpdate, autofocus }) => (
  <SlateTextInput
    value={data.content}
    onBlur={(value) => onUpdate({ content: value })}
    autofocus={autofocus}
    extraToolbarButtons={
      <>
        <Divider height={15} offset={4} isVertical />

        <MessageDelayButton icon={TOOLBAR_ICONS.DELAY} data={data} onUpdate={(value: Partial<BaseNode.Text.TextData>) => onUpdate(value)} />
      </>
    }
  />
);

export default TextInput;
