import { Handle as RCSliderHandle, HandleProps } from 'rc-slider';
import React from 'react';

// to prevent loosing editor focus
class Handle extends RCSliderHandle {
  // eslint-disable-next-line class-methods-use-this
  blur() {}

  // eslint-disable-next-line class-methods-use-this
  focus() {}
}

interface OpacitySliderHandleProps extends Omit<HandleProps, 'ariaValueTextFormatter'> {
  index: number;
  dragging?: boolean;
}

const OpacitySliderHandle = ({ index, dragging, ...restProps }: OpacitySliderHandleProps): React.ReactElement => {
  if (restProps.value === null) {
    return <></>;
  }

  return <Handle {...restProps} key={index} />;
};

export default OpacitySliderHandle;
