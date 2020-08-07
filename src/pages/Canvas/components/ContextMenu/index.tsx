import React from 'react';
import { Popper } from 'react-popper';

import NestedMenu from '@/components/NestedMenu';
import { FeatureFlag } from '@/config/features';
import { CLIPBOARD_DATA_KEY } from '@/constants';
import { BlockVariant } from '@/constants/canvas';
import * as Workspace from '@/ducks/workspace';
import { connect, styled } from '@/hocs';
import { useFeature } from '@/hooks';
import { ClipboardContext, ClipboardContextValue, ContextMenuContext, ContextMenuValue, EngineContext } from '@/pages/Canvas/contexts';
import type { Engine } from '@/pages/Canvas/engine';
import { MarkupModeContext } from '@/pages/Skill/contexts';
import { useCommentingMode } from '@/pages/Skill/hooks';
import { buildVirtualElement } from '@/utils/dom';
import { Coords } from '@/utils/geometry';

import { CanvasAction, TARGET_OPTIONS } from './constants';

const NestedContextMenu: React.FC<any> = NestedMenu;

type OptionHandler = (contextMenu: ContextMenuValue, props: { engine: Engine; clipboard: ClipboardContextValue; blockColor?: BlockVariant }) => void;

const OPTION_HANDLERS: Record<CanvasAction, OptionHandler> = {
  [CanvasAction.PASTE]: ({ position }, { engine }) => {
    const clipboardDataKey = localStorage.getItem(CLIPBOARD_DATA_KEY);

    if (clipboardDataKey) {
      engine.paste(clipboardDataKey, new Coords(position!));
    }
  },

  [CanvasAction.COPY_BLOCK]: ({ target: nodeID }, { clipboard }) => clipboard.copy(nodeID!),

  [CanvasAction.RENAME_BLOCK]: ({ target: nodeID }, { engine }) => engine.node.rename(nodeID!),

  [CanvasAction.DELETE_BLOCK]: ({ target: nodeID }, { engine }) => {
    if (engine.node.isSubtreeActive(nodeID!)) {
      engine.clearActivation();
    }

    engine.node.remove(nodeID!);
  },

  [CanvasAction.COLOR_BLOCK]: ({ target: nodeID }, { engine, blockColor }) => blockColor && engine.node.updateBlockColor(nodeID!, blockColor),

  [CanvasAction.RETURN_TO_HOME]: (_, { engine }) => engine.focusHome(),
};

export type ContextMenuProps = {
  className?: string;
  isTemplateWorkspace: boolean;
};

const ContextMenu: React.FC<ContextMenuProps> = ({ className, isTemplateWorkspace }) => {
  const contextMenu = React.useContext(ContextMenuContext)!;
  const engine = React.useContext(EngineContext)!;
  const clipboard = React.useContext(ClipboardContext)!;
  const markupFeature = useFeature(FeatureFlag.MARKUP);
  const markupTool = React.useContext(MarkupModeContext);

  const isCommentingModeEnabled = useCommentingMode();

  const optionProps = {
    engine,
    clipboard,
    isMarkupFeatureEnabled: !!markupFeature?.isEnabled,
    isMarkupModeEnabled: !!markupTool?.isOpen,
    isTemplate: isTemplateWorkspace,
    isCommentingModeEnabled,
  };
  const options =
    contextMenu.type && TARGET_OPTIONS[contextMenu.type]?.filter((option) => !option.shouldRender || option.shouldRender(contextMenu, optionProps));

  const onSelect = async (_: any, [menuItemIndex, nestedMenuItemIndex]: [number, number]) => {
    const option = options![menuItemIndex];
    const blockColor = option?.options?.[nestedMenuItemIndex].value;

    await OPTION_HANDLERS[option.value](contextMenu, { ...optionProps, blockColor });
    contextMenu.onHide();
  };

  const getOptionValue = (option: { value?: any }) => option?.value;

  const getOptionLabel = (selectedValue: any) => {
    const flattenedOptions = options!.flatMap(({ label, value, options = [] }) => [{ value, label }, ...options.flatMap((option) => [option])]);

    const option = flattenedOptions.find((option) => option.value === selectedValue);
    return option?.label;
  };

  React.useEffect(() => {
    const onHide = contextMenu.onHide;

    document.addEventListener('mousedown', onHide);

    return () => document.removeEventListener('mousedown', onHide);
  }, [contextMenu.onHide]);

  if (!contextMenu.isOpen || !options || !options?.length) {
    return null;
  }

  return (
    <Popper referenceElement={buildVirtualElement(contextMenu.position!)} placement="right-start" positionFixed>
      {({ ref, style, placement }) => (
        <div ref={ref} style={style} data-placement={placement} className={className}>
          <NestedContextMenu options={options} onSelect={onSelect} getOptionValue={getOptionValue} getOptionLabel={getOptionLabel} />
        </div>
      )}
    </Popper>
  );
};

const mapStateToProps = {
  isTemplateWorkspace: Workspace.isTemplateWorkspaceSelector,
};

const ConnectedContextMenu = connect(mapStateToProps)(ContextMenu);

export default styled(ConnectedContextMenu)`
  z-index: 10;
`;
