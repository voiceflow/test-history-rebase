import React from 'react';

import InfoText from '@/components/InfoText';
import { styled } from '@/hocs';

import ToggleLabel from './ToggleLabel';

const OptionToggleContainer = styled(InfoText)`
  display: flex;
  align-items: baseline;
  user-select: none;
  cursor: pointer;
`;

function OptionToggle({ id, checked, onToggle, children }) {
  return (
    // eslint-disable-next-line xss/no-mixed-html
    <OptionToggleContainer as="label" {...{ htmlFor: id }}>
      <input id={id} type="checkbox" checked={checked} onChange={onToggle} />
      <ToggleLabel>{children}</ToggleLabel>
    </OptionToggleContainer>
  );
}

export default OptionToggle;
