import { Eventual, Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { serializeToText } from '@voiceflow/slate-serializer/text';
import { Box, buildVirtualElement, NestedMenu, Text, useCache, useVirtualElementPopper } from '@voiceflow/ui';
import React from 'react';

import { BlockType, CANVAS_ZOOM_DELTA, CLIPBOARD_DATA_KEY } from '@/constants';
import { Permission } from '@/constants/permissions';
import { Diagram, UI } from '@/ducks';
import { useDispatch, usePermission } from '@/hooks';
import { usePaymentModal } from '@/hooks/modal.hook';
import { ClipboardContext, ContextMenuContext, ContextMenuValue, EngineContext } from '@/pages/Canvas/contexts';
import { MarkupContext } from '@/pages/Project/contexts';
import { Identifier } from '@/styles/constants';
import * as Clipboard from '@/utils/clipboard';
import { Coords } from '@/utils/geometry';

import { EntityType } from '../../engine/constants';
import { CanvasAction, TARGET_OPTIONS } from './constants';
import { ContextMenuOption, OptionProps } from './types';

type OptionHandler = (contextMenu: ContextMenuValue, props: OptionProps) => Eventual<void>;

const OPTION_HANDLERS: Record<CanvasAction, OptionHandler> = {
  [CanvasAction.PASTE]: ({ position }, { engine }) => {
    const clipboardDataKey = localStorage.getItem(CLIPBOARD_DATA_KEY);

    if (clipboardDataKey) {
      engine.paste(clipboardDataKey, new Coords(position!));
    }
  },

  [CanvasAction.COPY_BLOCK]: ({ target: nodeID }, { clipboard }) => clipboard.copy(nodeID),

  /** this is a temporary implementation while viewers can not access node editors */
  [CanvasAction.COPY_CONTENT]: ({ target: nodeID }, { engine }) => {
    const node = nodeID && engine.getDataByNodeID<any>(nodeID);
    const variables = engine.select(Diagram.active.allSlotsAndVariablesNormalizedSelector);

    let variants: string[] = [];
    if (node?.type === BlockType.TEXT) {
      variants = (node as Realtime.NodeData.Text).texts?.map((text) =>
        serializeToText(text.content, { variablesMap: variables.byKey })
      );
    }
    if (node?.type === BlockType.SPEAK) {
      variants = (node as Realtime.NodeData.Speak).dialogs?.map((dialog) =>
        dialog.type === Realtime.DialogType.VOICE ? dialog.content : dialog.url
      );
    }

    if (variants.length) {
      Clipboard.copyWithToast(
        variants.join('\n\n'),
        variants.length > 1 ? 'All variants copied to clipboard' : 'Copied to clipboard'
      )();
    }
  },

  [CanvasAction.DUPLICATE_BLOCK]: ({ target: nodeID }, { engine }) => {
    const targets = nodeID ? [nodeID] : engine.activation.getTargets(EntityType.NODE);

    engine.node.duplicateMany(targets);
  },

  [CanvasAction.RENAME_BLOCK]: ({ target: nodeID }, { engine }) => engine.node.rename(nodeID!),

  [CanvasAction.DELETE_BLOCK]: async ({ target: nodeID }, { engine }) => {
    if (nodeID) {
      if (engine.node.isSubtreeActive(nodeID)) {
        engine.clearActivation();
      }

      await engine.node.remove(nodeID);
    } else {
      await engine.removeActive();
    }
  },

  [CanvasAction.COLOR_BLOCK]: Utils.functional.noop,

  [CanvasAction.SAVE_TO_LIBRARY]: Utils.functional.noop,

  [CanvasAction.CREATE_COMPONENT]: async (_, { engine }) => engine.createComponent(),

  [CanvasAction.RETURN_TO_HOME]: (_, { engine }) => engine.focusHome(),

  [CanvasAction.DIVIDER]: Utils.functional.noop,

  [CanvasAction.TOGGLE_UI]: (_, { toggleCanvasOnly }) => toggleCanvasOnly(),

  [CanvasAction.ZOOM_IN]: (_, { engine }) => {
    engine.canvas?.applyTransition();
    engine.canvas?.zoomIn(CANVAS_ZOOM_DELTA);
  },
  [CanvasAction.ZOOM_OUT]: (_, { engine }) => {
    engine.canvas?.applyTransition();
    engine.canvas?.zoomOut(CANVAS_ZOOM_DELTA);
  },

  [CanvasAction.ADD_TEXT]: (_, { markup }) => markup.startTextCreation(),

  [CanvasAction.ADD_IMAGE]: (_, { markup }) => markup.triggerMediaUpload(),

  [CanvasAction.ADD_COMMENT]: (_, { engine, paymentModal, canUseCommenting }) => {
    if (!canUseCommenting) {
      paymentModal.openVoid({});

      return;
    }

    engine.comment.activate();
  },

  [CanvasAction.ADD_TRIGGER]: (_, { engine }) => {
    engine.node.add({ type: BlockType.TRIGGER, coords: engine.getMouseCoords() });
  },
};

const isCanvasActionValue = (value: string): value is CanvasAction =>
  Object.values<string>(CanvasAction).includes(value);

const ContextMenu: React.FC = () => {
  const toggleCanvasOnly = useDispatch(UI.action.ToggleCanvasOnly);

  const engine = React.useContext(EngineContext)!;
  const markup = React.useContext(MarkupContext)!;
  const clipboard = React.useContext(ClipboardContext)!;
  const contextMenu = React.useContext(ContextMenuContext)!;

  const paymentModal = usePaymentModal();

  const [canEditCanvas] = usePermission(Permission.PROJECT_CANVAS_UPDATE);
  const [canUseCommenting] = usePermission(Permission.PROJECT_COMMENT);
  const [showHintFeatures] = usePermission(Permission.PROJECT_CANVAS_HINT_FEATURES);

  const cache = useCache({
    engine,
    markup,
    clipboard,
    contextMenu,
    paymentModal,
    canEditCanvas,
    canUseCommenting,
    toggleCanvasOnly,
    showHintFeatures,
  });

  const options = React.useMemo<ContextMenuOption[]>(() => {
    if (!contextMenu.type || !TARGET_OPTIONS[contextMenu.type]?.({ viewerOnly: !canEditCanvas }).length) {
      return [];
    }

    const targetOptions = TARGET_OPTIONS[contextMenu.type]({ viewerOnly: !canEditCanvas })
      .filter((option) => {
        return !option.shouldRender || option.shouldRender(contextMenu, cache.current);
      })
      .map(({ render, ...option }) => ({
        ...option,
        render: render ? () => render(cache.current.contextMenu, cache.current) : undefined,
      }));

    if (targetOptions[0]?.value === CanvasAction.DIVIDER) {
      targetOptions.shift();
    }

    if (targetOptions[targetOptions.length - 1]?.value === CanvasAction.DIVIDER) {
      targetOptions.pop();
    }

    return targetOptions;
  }, [contextMenu.type, contextMenu.target]);

  const optionsMap = React.useMemo(() => {
    const flattenedOptions = options.flatMap(({ label, value, options = [] }) => [
      [value, label] as const,
      ...options.map((option) => [option.value ?? '', option.label] as const),
    ]);

    return Object.fromEntries(flattenedOptions);
  }, [options]);

  const onSelect = async (value: string) => {
    contextMenu.onHide();

    if (isCanvasActionValue(value)) {
      await OPTION_HANDLERS[value](contextMenu, cache.current);
    }
  };

  const virtualElement = React.useMemo(() => buildVirtualElement(contextMenu.position), [contextMenu.position]);

  const popper = useVirtualElementPopper(virtualElement, { strategy: 'fixed', placement: 'right-start' });

  if (!contextMenu.isOpen || !options?.length) {
    return null;
  }

  return (
    <div
      id={Identifier.CONTEXT_MENU}
      key={`${contextMenu.target}-${contextMenu.position}`}
      ref={popper.setPopperElement}
      style={{ ...popper.styles.popper, zIndex: 10 }}
      {...popper.attributes.popper}
    >
      <NestedMenu
        onHide={contextMenu.onHide}
        options={options}
        onSelect={onSelect}
        getOptionKey={(option) => (option?.value === CanvasAction.DIVIDER ? option.label : option.value)}
        getOptionValue={(option) => option?.value}
        getOptionLabel={(value) => (value ? optionsMap[value] : '')}
        renderOptionLabel={(option) => (
          <Box.Flex width="100%" justifyContent="space-between">
            <Text>{option.label}</Text>

            {!!option.hotkey && (
              <Text marginLeft={32} fontSize={13} color="#8da2b5">
                {option?.hotkey}
              </Text>
            )}
          </Box.Flex>
        )}
      />
    </div>
  );
};

export default ContextMenu;
