import React from 'react';

import { Section } from '.';

function SingleSectionBlock({ state, variant, name, icon, children }) {
  return (
    <Section state={state} variant={variant} name={name} icon={icon}>
      {children}
    </Section>
  );
}

export default SingleSectionBlock;
