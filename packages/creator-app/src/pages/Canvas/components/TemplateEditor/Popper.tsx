import { Popper, PopperTypes } from '@voiceflow/ui';
import React from 'react';

import TemplatePopperEditor, { TemplateEditorProps } from '.';

export interface CanvasTemplateEditorPopperProps extends TemplateEditorProps {
  isOpen: boolean;
  nodeIDs: string[];
  onClose?: VoidFunction;
  onOpen?: VoidFunction;
  modifiers?: PopperTypes.Modifiers;
  placement?: PopperTypes.Placement;
  children: (props: { onToggle: VoidFunction }) => React.ReactNode;
  isSubmitting?: boolean;
  hasManager?: boolean;
}

const CanvasTemplateEditorPopper: React.FC<CanvasTemplateEditorPopperProps> = ({
  isOpen,
  onClose,
  onOpen,
  nodeIDs,
  children,
  modifiers,
  placement,
  isSubmitting,
  ...props
}) => {
  return (
    <Popper
      opened={isOpen}
      preventClose={() => !!isSubmitting}
      onClose={() => !isSubmitting && onClose?.()}
      onOpen={onOpen}
      modifiers={modifiers}
      placement={placement}
      portalNode={document.body}
      renderContent={() => <TemplatePopperEditor {...props} nodeIDs={nodeIDs} isSubmitting={isSubmitting} />}
      disableLayers={isSubmitting}
    >
      {({ ref, onToggle }) => <span ref={ref}>{children({ onToggle })}</span>}
    </Popper>
  );
};

export default CanvasTemplateEditorPopper;
