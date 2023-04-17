import { CONTEXT_MENU_IGNORED_CLASS_NAME } from '@voiceflow/ui';
import cn from 'classnames';
import React from 'react';

import { ClassName } from '@/styles/constants';

import { Input } from './components';
import TextEditor from './TextEditor';

export { PluginType } from './plugins';

const TextEditorInput = (
  { icon, variant, iconProps, className, wrapperProps, leftAction, rightAction, error, disabled, isActive, ...props },
  ref
) => (
  <Input
    ref={ref}
    icon={icon}
    error={error}
    variant={variant}
    isActive={isActive}
    disabled={disabled}
    className={cn(ClassName.TEXT_EDITOR, CONTEXT_MENU_IGNORED_CLASS_NAME, className)}
    iconProps={iconProps}
    leftAction={leftAction}
    rightAction={rightAction}
    wrapperProps={wrapperProps}
  >
    {({ ref }) => <TextEditor ref={ref} {...props} disabled={disabled} />}
  </Input>
);

export default React.forwardRef(TextEditorInput);
