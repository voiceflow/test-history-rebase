import React from 'react';

import { BlockState, BlockVariant } from '@/constants/canvas';

import { Container } from './components';
import MultiSectionBlock, { MultiSectionBlockProps } from './components/MultiSectionBlock';
import SingleSectionBlock, { SingleSectionBlockProps } from './components/SingleSectionBlock';

export * from './types';

export enum SectionsVariant {
  MULTI_SECTION = 'multi',
  SINGLE_SECTION = 'single',
}

export type NewBlockProps = (
  | ({ sectionsVariant?: SectionsVariant.SINGLE_SECTION } & WithOptional<SingleSectionBlockProps, 'state' | 'variant'>)
  | ({ sectionsVariant: SectionsVariant.MULTI_SECTION } & MultiSectionBlockProps)
) & {
  state?: BlockState;
  variant?: BlockVariant;
  isActive?: boolean;
};

const NewBlock: React.RefForwardingComponent<HTMLDivElement, NewBlockProps> = (
  { state = BlockState.REGULAR, variant = BlockVariant.STANDARD, sectionsVariant = SectionsVariant.SINGLE_SECTION, ...props },
  ref
) => (
  <Container variant={variant} state={state} ref={ref}>
    {sectionsVariant === SectionsVariant.SINGLE_SECTION ? (
      <SingleSectionBlock state={state} variant={variant} {...(props as SingleSectionBlockProps)} />
    ) : (
      <MultiSectionBlock {...(props as MultiSectionBlockProps)} />
    )}
  </Container>
);

export default React.forwardRef(NewBlock);
