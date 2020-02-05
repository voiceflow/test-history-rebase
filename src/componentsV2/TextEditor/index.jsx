import React from 'react';

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
    className={className}
    iconProps={iconProps}
    leftAction={leftAction}
    rightAction={rightAction}
    wrapperProps={wrapperProps}
  >
    {({ ref }) => <TextEditor ref={ref} {...props} disabled={disabled} />}
  </Input>
);

export default React.forwardRef(TextEditorInput);
