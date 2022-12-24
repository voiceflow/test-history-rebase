import { useConst } from '@voiceflow/ui';
import React from 'react';

import { withNamespace } from '@/hocs/withNamespace';
import { useSectionState } from '@/pages/Canvas/hooks/section';

interface PersistCollapseProps {
  children: (props: { collapsed: boolean; onToggle: (collapsed?: boolean) => void; className?: string }) => React.ReactElement;
  className?: string;
  defaultCollapsed?: boolean;
}

const PersistCollapse: React.FC<PersistCollapseProps> = ({ children, defaultCollapsed = false, className }) => {
  const initialState = useConst({ isOpen: !defaultCollapsed });

  const [state, setState] = useSectionState<{ isOpen: boolean }>({
    sectionKey: null,
    defaultValue: initialState,
  });

  const onToggle = React.useCallback(() => setState({ isOpen: !state.isOpen }), [state.isOpen, setState]);

  return children({ collapsed: !state.isOpen, onToggle, className });
};

export default withNamespace<void, PersistCollapseProps>(PersistCollapse);
