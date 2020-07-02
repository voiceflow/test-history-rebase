import React from 'react';

import SpeakItem, { SpeakItemProps } from '@/pages/Canvas/components/SpeakItem';

type StyledSpeakItemProps = Omit<SpeakItemProps, 'styles'>;

const StyledSpeakItem: React.ForwardRefRenderFunction<HTMLDivElement, StyledSpeakItemProps> = (props, ref) => (
  <SpeakItem {...props} ref={ref} formControlProps={{ contentBottomUnits: 2.5 }} />
);

export default React.forwardRef(StyledSpeakItem);
