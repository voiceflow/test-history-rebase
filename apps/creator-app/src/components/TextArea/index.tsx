/* eslint-disable xss/no-mixed-html */
import { Utils } from '@voiceflow/common';
import { withEnterPress, withTargetValue } from '@voiceflow/ui';
import React from 'react';
import { TextareaAutosizeProps } from 'react-textarea-autosize';

import * as S from './styles';

interface InjectedProps {
  error?: boolean;
  onChangeText?: (text: string) => void;
  onEnterPress?: React.KeyboardEventHandler<HTMLTextAreaElement>;
}

interface BaseTextAreaProps {
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  onKeyPress?: React.KeyboardEventHandler<HTMLTextAreaElement>;
}

const withInputProps = <P extends BaseTextAreaProps, R>(Component: React.ComponentType<P>) =>
  React.forwardRef<R, P & InjectedProps>(({ onChange, onKeyPress, onChangeText, onEnterPress, ...props }, ref) => (
    <Component
      ref={ref}
      onChange={Utils.functional.chain(onChange, onChangeText && withTargetValue(onChangeText))}
      onKeyPress={Utils.functional.chain(
        onKeyPress,
        onEnterPress && (withEnterPress(onEnterPress) as React.KeyboardEventHandler<HTMLTextAreaElement>)
      )}
      {...(props as P)}
    />
  ));

export const StaticTextArea = withInputProps<React.ComponentProps<'textarea'>, HTMLTextAreaElement>(S.StaticTextArea);
const TextArea = withInputProps<Omit<TextareaAutosizeProps, 'ref'>, HTMLTextAreaElement>(S.TextArea);

export default TextArea;
