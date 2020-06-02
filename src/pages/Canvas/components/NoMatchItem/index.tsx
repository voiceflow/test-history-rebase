import React from 'react';

import SpeakItem, { SpeakItemProps } from '@/pages/Canvas/components/SpeakItem';

export type NoMatchItemProps = SpeakItemProps & {
  index: number;
};

const NO_MATCH_NUMBERS = ['One', 'Two', 'Three'];

const NoMatchItem: React.RefForwardingComponent<HTMLDivElement, NoMatchItemProps> = (props, ref) => {
  const number = NO_MATCH_NUMBERS[props.index] ?? '';

  return <SpeakItem {...props} header={`No Match ${number}`} ref={ref} />;
};

export default React.forwardRef(NoMatchItem);
