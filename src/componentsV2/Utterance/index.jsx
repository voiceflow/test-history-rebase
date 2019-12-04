import React from 'react';

import Input from '@/componentsV2/Input';

import Utterance from './Utterance';

// eslint-disable-next-line react/display-name
const UtteranceInput = React.forwardRef(({ icon, iconProps, wrapperProps, leftAction, rightAction, error, disabled, ...props }, ref) => {
  return (
    <Input
      icon={icon}
      iconProps={iconProps}
      wrapperProps={wrapperProps}
      leftAction={leftAction}
      rightAction={rightAction}
      error={error}
      disabled={disabled}
      ref={ref}
    >
      {({ ref }) => <Utterance ref={ref} {...props} disabled={disabled} />}
    </Input>
  );
});

export default UtteranceInput;
