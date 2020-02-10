import cuid from 'cuid';
import React from 'react';
import { Popper } from 'react-popper';

import Menu from '@/components/Menu';
import { BlockType, CLIPBOARD_DATA_KEY } from '@/constants';
import { styled } from '@/hocs';
import { ContextMenuContext, withClipboard, withEngine } from '@/pages/Canvas/contexts';
import { compose } from '@/utils/functional';

import { CanvasAction, TARGET_OPTIONS } from './constants';
import { buildVirtualElement } from './utils';

const OPTION_HANDLERS = {
  [CanvasAction.PASTE]: ({ position }, { engine }) => engine.paste(localStorage.getItem(CLIPBOARD_DATA_KEY), engine.canvas.transformPoint(position)),
  [CanvasAction.COPY_BLOCK]: ({ target: nodeID }, { clipboard }) => clipboard.copy(nodeID),
  [CanvasAction.ADD_COMMENT]: ({ position }, { engine }) => engine.node.add(cuid(), BlockType.COMMENT, engine.canvas.transformPoint(position)),
  [CanvasAction.RENAME_BLOCK]: ({ target: nodeID }, { engine }) => engine.node.rename(nodeID),

  [CanvasAction.DELETE_BLOCK]: ({ target: nodeID }, { engine }) => {
    if (engine.isActive(nodeID) || engine.isNestedNodeActive(nodeID)) {
      engine.clearActivation();
    }

    engine.node.remove(nodeID);
  },
};

const ContextMenu = ({ className, ...props }) => {
  const contextMenu = React.useContext(ContextMenuContext);
  const options =
    contextMenu.type && TARGET_OPTIONS[contextMenu.type]?.filter((option) => !option.shouldRender || option.shouldRender(contextMenu, props));
  const onSelect = async (option) => {
    await OPTION_HANDLERS[option](contextMenu, props);
    contextMenu.onHide();
  };

  React.useEffect(() => {
    const onHide = contextMenu.onHide;

    document.addEventListener('mousedown', onHide);

    return () => document.removeEventListener('mousedown', onHide);
  }, [contextMenu.onHide]);

  if (!contextMenu.isOpen || !options) {
    return null;
  }

  return (
    <Popper referenceElement={buildVirtualElement(contextMenu.position)} placement="right-start" positionFixed>
      {({ ref, style, placement }) => (
        <div ref={ref} style={style} data-placement={placement} className={className}>
          <Menu options={options} onSelect={onSelect} />
        </div>
      )}
    </Popper>
  );
};

export default styled(compose(withEngine, withClipboard)(ContextMenu))`
  z-index: 10;
`;
