import React from 'react';

import { useToggle } from '@/hooks';
import { useDidUpdateEffect } from '@/hooks/lifecycle';

import { UncontrolledSection } from './components';
import { UncontrolledSectionProps } from './components/UncontrolledSection';

export * from './components';
export * from './constants';

export type SectionProps = UncontrolledSectionProps & {
  initialOpen?: boolean;
  onToggleChange?: (collapsed: boolean) => void;
};

const Section: React.FC<SectionProps> = (
  { initialOpen = false, onToggleChange, collapseVariant = null, ...props },
  ref: React.Ref<HTMLDivElement>
) => {
  const [isCollapsed, toggle] = useToggle(!!collapseVariant && !initialOpen);

  useDidUpdateEffect(() => {
    if (onToggleChange) {
      onToggleChange(isCollapsed);
    }
  }, [isCollapsed]);

  return <UncontrolledSection {...props} isCollapsed={isCollapsed} collapseVariant={collapseVariant} toggle={toggle} ref={ref} />;
};

export default React.forwardRef<HTMLDivElement, SectionProps>(Section);
