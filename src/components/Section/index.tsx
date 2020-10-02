import React from 'react';

import { styled } from '@/hocs';
import { useToggle } from '@/hooks';
import { useDidUpdateEffect } from '@/hooks/lifecycle';

import { ContentContainer, UncontrolledSection } from './components';
import { UncontrolledSectionProps } from './components/UncontrolledSection';

export * from './components';
export * from './constants';

export type SectionProps = UncontrolledSectionProps & {
  initialOpen?: boolean;
  onToggleChange?: (collapsed: boolean) => void;
};

const Section: React.ForwardRefRenderFunction<HTMLDivElement, SectionProps> = (
  { initialOpen = false, onToggleChange, collapseVariant = null, ...props },
  ref
) => {
  const [isCollapsed, toggle] = useToggle(!!collapseVariant && !initialOpen);

  useDidUpdateEffect(() => {
    if (onToggleChange) {
      onToggleChange(isCollapsed);
    }
  }, [isCollapsed]);

  return <UncontrolledSection {...props} isCollapsed={isCollapsed} collapseVariant={collapseVariant} toggle={toggle} ref={ref} />;
};

const RefForwardedSection = React.forwardRef<HTMLDivElement, SectionProps>(Section);

export default RefForwardedSection;

export const InfoSection = styled(RefForwardedSection)`
  display: flex;
  align-items: center;
  min-height: 72px;
  color: #62778c;

  ${ContentContainer} {
    padding-top: 25px;
    padding-bottom: 25px;
  }
`;
