import React from 'react';

import Tooltip, { Section, Title } from '.';

export default {
  title: 'Tooltip',
  component: Tooltip,
};

export const normal = () => (
  <Tooltip
    anchorRenderer={({ ref, isOpen, onToggle }) => (
      <span ref={ref} onClick={onToggle}>
        {isOpen ? 'tooltip is opened' : 'click here to open'}
      </span>
    )}
  >
    <Title>Tooltip title</Title>

    <Section>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
      velit esse cillum dolore eu fugiat nulla pariatur.
    </Section>

    <Title isSubtitle>Tooltip subtitle</Title>

    <Section>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
      veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
      velit esse cillum dolore eu fugiat nulla pariatur.
    </Section>
  </Tooltip>
);
