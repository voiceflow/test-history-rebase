import cuid from 'cuid';
import React from 'react';
import { Popper } from 'react-popper';

import Menu from '@/componentsV2/Menu';
import { BlockType } from '@/constants';
import { ContextMenuContext, withClipboard, withEngine } from '@/containers/CanvasV2/contexts';
import { styled } from '@/hocs';
import { compose } from '@/utils/functional';

import { CanvasAction, TARGET_OPTIONS } from './constants';
import { buildVirtualElement } from './utils';

const OPTION_HANDLERS = {
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
  const onSelect = (option) => {
    OPTION_HANDLERS[option](contextMenu, props);
    contextMenu.onHide();
  };

  React.useEffect(() => {
    const onHide = contextMenu.onHide;

    document.addEventListener('click', onHide);

    return () => document.removeEventListener('click', onHide);
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

export default styled(
  compose(
    withEngine,
    withClipboard
  )(ContextMenu)
)`
  z-index: 10;
`;
