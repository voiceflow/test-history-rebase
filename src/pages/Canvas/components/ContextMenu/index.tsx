import React from 'react';
import { Popper } from 'react-popper';

import { Flex } from '@/components/Box';
import NestedMenu from '@/components/NestedMenu';
import Text from '@/components/Text';
import { Permission } from '@/config/permissions';
import { CLIPBOARD_DATA_KEY, ModalType } from '@/constants';
import { BlockVariant } from '@/constants/canvas';
import * as UIDuck from '@/ducks/ui';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
import { useCache, useModals, usePermission } from '@/hooks';
import { ClipboardContext, ContextMenuContext, ContextMenuValue, EngineContext } from '@/pages/Canvas/contexts';
import { MarkupContext } from '@/pages/Skill/contexts';
import { Identifier } from '@/styles/constants';
import { ConnectedProps } from '@/types';
import { buildVirtualElement } from '@/utils/dom';
import { noop } from '@/utils/functional';
import { Coords } from '@/utils/geometry';

import { CanvasAction, TARGET_OPTIONS } from './constants';
import { ContextMenuOption, OptionProps } from './types';

const NestedContextMenu: React.FC<any> = NestedMenu;

type OptionHandler = (contextMenu: ContextMenuValue, props: OptionProps) => void;

const OPTION_HANDLERS: Record<CanvasAction, OptionHandler> = {
  [CanvasAction.PASTE]: ({ position }, { engine }) => {
    const clipboardDataKey = localStorage.getItem(CLIPBOARD_DATA_KEY);

    if (clipboardDataKey) {
      engine.paste(clipboardDataKey, new Coords(position!));
    }
  },

  [CanvasAction.COPY_BLOCK]: ({ target: nodeID }, { clipboard }) => clipboard.copy(nodeID!),

  [CanvasAction.DUPLICATE_BLOCK]: ({ target: nodeID }, { engine }) => engine.node.duplicate(nodeID!),

  [CanvasAction.RENAME_BLOCK]: ({ target: nodeID }, { engine }) => engine.node.rename(nodeID!),

  [CanvasAction.DELETE_BLOCK]: ({ target: nodeID }, { engine }) => {
    if (engine.node.isSubtreeActive(nodeID!)) {
      engine.clearActivation();
    }

    engine.node.remove(nodeID!);
  },

  [CanvasAction.COLOR_BLOCK]: ({ target: nodeID }, { engine, blockColor }) => {
    if (blockColor) {
      engine.node.updateBlockColor(nodeID!, blockColor);
      engine.selection.reset();
    }
  },

  [CanvasAction.RETURN_TO_HOME]: (_, { engine }) => engine.focusHome(),

  [CanvasAction.DIVIDER]: noop,

  [CanvasAction.TOGGLE_UI]: (_, { toggleCanvasOnly }) => toggleCanvasOnly(),

  [CanvasAction.ADD_TEXT]: (_, { markup }) => markup.startTextCreation(),

  [CanvasAction.ADD_IMAGE]: (_, { markup }) => markup.triggerImagesUpload(),

  [CanvasAction.ADD_COMMENT]: (_, { engine, isTemplate, upgradeModal, canUseCommenting }) => {
    if (isTemplate) {
      return;
    }

    if (!canUseCommenting) {
      upgradeModal.open();

      return;
    }

    engine.comment.activate();
  },
};

const ContextMenu: React.FC<ConnectedContextMenuProps> = ({ toggleCanvasOnly, isTemplateWorkspace }) => {
  const engine = React.useContext(EngineContext)!;
  const markup = React.useContext(MarkupContext)!;
  const clipboard = React.useContext(ClipboardContext)!;
  const contextMenu = React.useContext(ContextMenuContext)!;

  const upgradeModal = useModals(ModalType.PAYMENT);

  const [canUseCommenting] = usePermission(Permission.COMMENTING);
  const [showHintFeatures] = usePermission(Permission.HINT_FEATURES);

  const cache = useCache({
    engine,
    markup,
    clipboard,
    isTemplate: isTemplateWorkspace,
    upgradeModal,
    canUseCommenting,
    toggleCanvasOnly,
    showHintFeatures,
  });

  const options = React.useMemo(() => {
    if (!contextMenu.type || !TARGET_OPTIONS[contextMenu.type]?.length) {
      return [];
    }

    const targetOptions = TARGET_OPTIONS[contextMenu.type].filter(
      (option) => !option.shouldRender || option.shouldRender(contextMenu, cache.current)
    );

    if (targetOptions[0]?.value === CanvasAction.DIVIDER) {
      targetOptions.shift();
    }

    if (targetOptions[targetOptions.length - 1]?.value === CanvasAction.DIVIDER) {
      targetOptions.pop();
    }

    return targetOptions;
  }, [contextMenu.type]);

  const onSelect = async (_: unknown, [menuItemIndex, nestedMenuItemIndex]: [number, number]) => {
    const option = options![menuItemIndex];
    const blockColor = option?.options?.[nestedMenuItemIndex].value;

    await OPTION_HANDLERS[option.value](contextMenu, { ...cache.current, blockColor });

    contextMenu.onHide();
  };

  const getOptionKey = (option: ContextMenuOption<CanvasAction | BlockVariant>) =>
    option.value === CanvasAction.DIVIDER ? option.label : option.value;

  const getOptionValue = (option: ContextMenuOption<CanvasAction | BlockVariant> | undefined) => option?.value;

  const getOptionLabel = (selectedValue: CanvasAction | BlockVariant) => {
    const flattenedOptions: Array<
      ContextMenuOption<CanvasAction> | ContextMenuOption<BlockVariant>
    > = options!.flatMap(({ label, value, options = [] }) => [{ value, label }, ...options.flatMap((option) => [option])]);

    const option = flattenedOptions.find((option) => option.value === selectedValue);

    return option?.label;
  };

  React.useEffect(() => {
    const { onHide } = contextMenu;

    document.addEventListener('mousedown', onHide);

    return () => document.removeEventListener('mousedown', onHide);
  }, [contextMenu.onHide]);

  if (!contextMenu.isOpen || !options?.length) {
    return null;
  }

  return (
    <Popper referenceElement={buildVirtualElement(contextMenu.position!)} placement="right-start" positionFixed>
      {({ ref, style, placement }) => (
        <div id={Identifier.CONTEXT_MENU} ref={ref} style={{ ...style, zIndex: 10 }} data-placement={placement}>
          <NestedContextMenu
            options={options}
            onSelect={onSelect}
            getOptionKey={getOptionKey}
            getOptionValue={getOptionValue}
            getOptionLabel={getOptionLabel}
            maxVisibleItems={7}
            renderOptionLabel={(option: ContextMenuOption<CanvasAction> | ContextMenuOption<BlockVariant>) => (
              <Flex width="100%" justifyContent="space-between">
                <Text>{option.label}</Text>
                {!!option.hotkey && (
                  <Text marginLeft={32} fontSize={13} color="#8da2b5">
                    {option?.hotkey}
                  </Text>
                )}
              </Flex>
            )}
          />
        </div>
      )}
    </Popper>
  );
};

const mapStateToProps = {
  isTemplateWorkspace: Workspace.isTemplateWorkspaceSelector,
};

const mapDispatchToProps = {
  toggleCanvasOnly: UIDuck.toggleCanvasOnly,
};

type ConnectedContextMenuProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(ContextMenu);
