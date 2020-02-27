import React from 'react';

import { Section } from '.';

function MultiSectionBlock({ sections }) {
  return (
    <>
      {sections.map(({ state = 'regular', variant = 'standard', name, children, icon }, index) => {
        return (
          <Section key={index} state={state} variant={variant} name={name} icon={icon}>
            {children}
          </Section>
        );
      })}
    </>
  );
}

export default MultiSectionBlock;
