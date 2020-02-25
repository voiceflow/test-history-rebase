import cn from 'classnames';
import React from 'react';

import { CONTEXT_MENU_IGNORED_CLASS_NAME } from '@/components/ContextMenu';

import TextEditor from './TextEditor';
import { Input } from './components';

export { PluginType } from './plugins';

// eslint-disable-next-line react/display-name
const TextEditorInput = ({ icon, variant, iconProps, className, wrapperProps, leftAction, rightAction, error, disabled, ...props }, ref) => (
  <Input
    ref={ref}
    icon={icon}
    error={error}
    variant={variant}
    disabled={disabled}
    className={cn(CONTEXT_MENU_IGNORED_CLASS_NAME, className)}
    iconProps={iconProps}
    leftAction={leftAction}
    rightAction={rightAction}
    wrapperProps={wrapperProps}
  >
    {({ ref }) => <TextEditor ref={ref} {...props} disabled={disabled} />}
  </Input>
);

export default React.forwardRef(TextEditorInput);
