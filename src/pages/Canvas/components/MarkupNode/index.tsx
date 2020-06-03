import _noop from 'lodash/noop';
import React from 'react';

import { useSetup } from '@/hooks';
import { Markup, NodeData } from '@/models';
import { useNodeInstance } from '@/pages/Canvas/components/Node/hooks';
import { ManagerContext, NodeEntityContext, PresentationModeContext } from '@/pages/Canvas/contexts';
import { useNodeDrag } from '@/pages/Canvas/hooks';
import { ClassName } from '@/styles/constants';

import { ChildContainer, Container, NodeStyles } from './components';

const MarkupNode = () => {
  const isPresentationMode = React.useContext(PresentationModeContext);
  const nodeEntity = React.useContext(NodeEntityContext)!;
  const instance = useNodeInstance<HTMLDivElement>();
  const getManager = React.useContext(ManagerContext)!;
  const { node, data, isFocused } = nodeEntity.useState((e) => {
    const resolved = e.resolve();

    return {
      node: resolved.node,
      data: resolved.data,
      isFocused: e.isFocused,
    };
  });
  const { markupNode: NodeComponent } = getManager(nodeEntity.nodeType)!;

  const { onMouseDown } = useNodeDrag();

  // TODO: implement context menu
  const onRightClick = React.useCallback(_noop, []);

  nodeEntity.useInstance(instance);

  useSetup(() => {
    if (isFocused) {
      instance.ref.current?.focus();
    }
  });

  return (
    <>
      <NodeStyles />

      <Container
        className={ClassName.CANVAS_NODE}
        position={instance.getPosition()}
        isTransform={!isPresentationMode}
        onMouseDown={onMouseDown}
        onContextMenu={onRightClick}
        ref={instance.ref}
        tabIndex={-1}
      >
        {NodeComponent && (
          <ChildContainer>
            <NodeComponent node={node} data={data as NodeData<Markup.NodeData>} />
          </ChildContainer>
        )}
      </Container>
    </>
  );
};

export default MarkupNode;
