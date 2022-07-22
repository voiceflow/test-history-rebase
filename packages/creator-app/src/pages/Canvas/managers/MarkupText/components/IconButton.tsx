import { BaseIconButtonProps, IconButton as BaseIconButton, IconButtonBasicContainerProps } from '@voiceflow/ui';
import React from 'react';

const IconButton: React.ForwardRefRenderFunction<HTMLButtonElement, BaseIconButtonProps & Omit<IconButtonBasicContainerProps, 'variant' | 'size'>> = (
  props,
  ref
) => <BaseIconButton ref={ref} {...props} variant={BaseIconButton.Variant.BASIC} size={16} offsetSize={0} />;

export default React.forwardRef(IconButton);
