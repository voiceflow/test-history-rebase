import { Handle as RCSliderHandle, HandleProps } from 'rc-slider';
import React from 'react';

// to prevent loosing editor focus
class Handle extends RCSliderHandle {
  // eslint-disable-next-line class-methods-use-this
  blur() {}

  // eslint-disable-next-line class-methods-use-this
  focus() {}
}

const OpacitySliderHandle = ({
  index,
  dragging,
  ...restProps
}: Omit<HandleProps, 'ariaValueTextFormatter'> & { index: number; dragging?: boolean }): React.ReactElement => {
  if (restProps.value === null) {
    return <></>;
  }

  return <Handle {...restProps} key={index} />;
};

export default OpacitySliderHandle;
