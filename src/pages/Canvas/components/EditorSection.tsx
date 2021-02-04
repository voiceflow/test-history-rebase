import React from 'react';

import UncontrolledSection, { UncontrolledSectionProps } from '@/components/Section/components/UncontrolledSection';
import { withNamespace } from '@/hocs';
import { useSectionState } from '@/pages/Canvas/hooks';
import { compose } from '@/utils/functional';

type EditorSectionProps = Omit<UncontrolledSectionProps, 'isCollapsed' | 'toggle'> & {
  autoSave?: boolean;
  initialOpen?: boolean;
};

const EditorSection: React.ForwardRefRenderFunction<HTMLDivElement, EditorSectionProps> = (
  { autoSave = true, initialOpen = false, ...props },
  ref
) => {
  const isCollapsible = !!props.collapseVariant;
  const initialState = React.useRef(initialOpen);
  const [sectionState, setSectionState] = useSectionState<{ isOpen: boolean }>(null, { isOpen: initialState.current }, isCollapsible && autoSave);
  const toggleCollapsed = React.useCallback(() => setSectionState({ isOpen: !sectionState.isOpen }), [sectionState.isOpen, setSectionState]);

  const collapseProps = isCollapsible && { isCollapsed: !sectionState.isOpen, toggle: toggleCollapsed };

  return <UncontrolledSection {...collapseProps} {...props} ref={ref} />;
};

export default compose(withNamespace, React.forwardRef)(EditorSection) as React.ForwardRefExoticComponent<
  React.PropsWithoutRef<EditorSectionProps & { namespace?: string | string[] }> & React.RefAttributes<HTMLDivElement>
>;
