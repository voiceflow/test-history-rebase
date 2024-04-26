import { Utils } from '@voiceflow/common';
import { compose } from '@voiceflow/ui';
import React from 'react';

import type { UncontrolledSectionProps } from '@/components/Section/components/UncontrolledSection';
import UncontrolledSection from '@/components/Section/components/UncontrolledSection';
import { withNamespace } from '@/hocs/withNamespace';
import { useSectionState } from '@/pages/Canvas/hooks/section';

type EditorSectionProps = Omit<UncontrolledSectionProps, 'isCollapsed' | 'toggle'> & {
  initialOpen?: boolean;
  onContextMenu?: React.MouseEventHandler;
};

const EditorSection: React.ForwardRefRenderFunction<HTMLDivElement, EditorSectionProps> = (
  { initialOpen = false, ...props },
  ref
) => {
  const isCollapsible = !!props.collapseVariant;
  const initialState = React.useRef(initialOpen);

  const [sectionState, setSectionState] = useSectionState<{ isOpen: boolean }>({
    sectionKey: null,
    defaultValue: { isOpen: initialState.current },
  });

  const toggleCollapsed = React.useCallback(
    () => setSectionState({ isOpen: !sectionState.isOpen }),
    [sectionState.isOpen, setSectionState]
  );

  const collapseProps = isCollapsible && {
    isCollapsed: !sectionState.isOpen,
    toggle: props.disabled ? Utils.functional.noop : toggleCollapsed,
  };

  return <UncontrolledSection {...collapseProps} {...props} ref={ref} />;
};

export default compose(withNamespace, React.forwardRef)(EditorSection) as React.ForwardRefExoticComponent<
  React.PropsWithoutRef<EditorSectionProps & { namespace?: string | string[] }> & React.RefAttributes<HTMLDivElement>
>;
