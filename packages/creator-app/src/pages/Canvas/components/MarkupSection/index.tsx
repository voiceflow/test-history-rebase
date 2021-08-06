import { SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { UncontrolledSection } from '@/components/Section';

import { ContentContainer, IconContainer, Title } from './components';

export interface SectionProps {
  title?: string;
  isLast?: boolean;
  opened?: boolean;
  onAddRemove?: () => void;
}

const Section: React.FC<SectionProps> = ({ title, children, opened, isLast, onAddRemove }) => (
  <UncontrolledSection
    prefix={title && <Title>{title}</Title>}
    suffix={
      onAddRemove && (
        <IconContainer onClick={onAddRemove}>
          <SvgIcon icon={opened ? 'minus' : 'plus'} size={10} />
        </IconContainer>
      )
    }
    dividers
    isCollapsed={!onAddRemove ? false : !opened}
    forceDividers={!isLast}
    isDividerNested={!isLast && (opened || !onAddRemove)}
    isDividerBottom
  >
    <ContentContainer withoutHeader={!onAddRemove && !title}>{children}</ContentContainer>
  </UncontrolledSection>
);

export default Section;
