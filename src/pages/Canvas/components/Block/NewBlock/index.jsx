import React from 'react';

import { Container } from './components';
import MultiSectionBlock from './components/MultiSectionBlock';
import SingleSectionBlock from './components/SingleSectionBlock';

export const SECTIONS_VARIANT = {
  SINGLE_SECTION: 'single',
  MULTI_SECTION: 'multi',
};

const NewBlock = ({ sectionsVariant = SECTIONS_VARIANT.SINGLE_SECTION, variant = 'standard', state = 'regular', ...props }) => (
  <Container variant={variant} state={state}>
    {sectionsVariant === SECTIONS_VARIANT.SINGLE_SECTION ? <SingleSectionBlock variant={variant} {...props} /> : <MultiSectionBlock {...props} />}
  </Container>
);

export default NewBlock;
