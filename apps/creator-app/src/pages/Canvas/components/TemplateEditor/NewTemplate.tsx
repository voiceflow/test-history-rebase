import { COLOR_PICKER_CONSTANTS, toast, useLinkedState } from '@voiceflow/ui';
import React from 'react';
import { DismissableLayerContext } from 'react-dismissable-layers';

import * as CreatorV2 from '@/ducks/creatorV2';
import { useEventualEngine, useSelector } from '@/hooks';
import { Coords } from '@/utils/geometry';

import TemplatePopperEditor from './index';
import TemplatePopperEditorPopper, { CanvasTemplateEditorPopperProps } from './Popper';

interface CanvasTemplateEditorNewTemplateProps
  extends Omit<
    CanvasTemplateEditorPopperProps,
    'color' | 'onColorChange' | 'name' | 'onNameChange' | 'onNameChange' | 'onSubmit' | 'children' | 'isOpen'
  > {
  children?: (props: { onToggle: VoidFunction }) => React.ReactNode;
  nodeIDs: string[];
  isOpen?: boolean;
  withoutPopper?: boolean;
}

const CanvasTemplateEditorNewTemplate: React.FC<CanvasTemplateEditorNewTemplateProps> = ({
  withoutPopper,
  children,
  nodeIDs,
  onClose,
  isOpen = false,
  ...props
}) => {
  const { dismissAllGlobally } = React.useContext(DismissableLayerContext);
  const getEngine = useEventualEngine();
  const blockColor = useSelector(CreatorV2.blockColorSelector, { id: nodeIDs[0] }) || COLOR_PICKER_CONSTANTS.BLOCK_STANDARD_COLOR;

  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [color, setColor] = useLinkedState(blockColor);
  const [name, setName] = React.useState('');

  const onColorChange = (color: string) => {
    setColor(color);
  };

  const onSubmit = async ({ name, color }: { name: string; color: string }) => {
    try {
      const engine = getEngine();
      if (!engine) return;
      setIsSubmitting(true);

      engine.disableInteractions();

      const templateColor = blockColor !== color ? color : null;

      await engine?.canvasTemplate.createTemplate(name, templateColor, nodeIDs, new Coords([0, 0]));
      setName('');
      setIsSubmitting(false);

      engine.enableInteractions();
      toast.success(`Block template saved to library.`);

      dismissAllGlobally();
      onClose?.();
    } catch {
      setIsSubmitting(false);
      toast.error('Something went wrong, please contact support if this issue persists.');
    }
  };

  if (withoutPopper) {
    return (
      <TemplatePopperEditor
        {...props}
        nodeIDs={nodeIDs}
        color={color}
        name={name}
        onColorChange={onColorChange}
        onNameChange={setName}
        onSubmit={onSubmit}
        isSubmitting={isSubmitting}
      />
    );
  }

  if (!children) {
    return null;
  }

  return (
    <TemplatePopperEditorPopper
      {...props}
      nodeIDs={nodeIDs}
      color={color}
      name={name}
      onColorChange={onColorChange}
      onNameChange={setName}
      onSubmit={onSubmit}
      isSubmitting={isSubmitting}
      isOpen={isOpen}
    >
      {children}
    </TemplatePopperEditorPopper>
  );
};

export default CanvasTemplateEditorNewTemplate;
