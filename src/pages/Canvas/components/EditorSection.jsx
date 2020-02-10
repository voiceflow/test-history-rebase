import React from 'react';

import { UncontrolledSection } from '@/componentsV2/Section';
import { withNamespace } from '@/hocs';
import { useSectionState } from '@/pages/Canvas/hooks';
import { compose } from '@/utils/functional';

function EditorSection({ data, autoSave = true, initialOpen = false, ...props }, ref) {
  const isCollapsible = !!props.collapseVariant;
  const initialState = React.useRef(initialOpen);
  const [sectionState, setSectionState] = useSectionState(null, { isOpen: initialState.current }, isCollapsible && autoSave);
  const toggleCollapsed = React.useCallback(() => setSectionState({ isOpen: !sectionState.isOpen }), [sectionState.isOpen, setSectionState]);

  const collapseProps = isCollapsible && { isCollapsed: !sectionState.isOpen, toggle: toggleCollapsed };

  return <UncontrolledSection {...collapseProps} {...props} ref={ref} />;
}

export default compose(
  withNamespace,
  React.forwardRef
)(EditorSection);
