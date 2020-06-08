import _noop from 'lodash/noop';
import React from 'react';

import { useSetup } from '@/hooks';
import { Markup, NodeData } from '@/models';
import { CANVAS_MARKUP_ENABLED } from '@/pages/Canvas/constants';
import { EngineContext, ManagerContext, NodeEntityContext, PresentationModeContext } from '@/pages/Canvas/contexts';
import { useNodeDrag } from '@/pages/Canvas/hooks';
import { ClassName } from '@/styles/constants';

import { ChildContainer, Container, NodeStyles } from './components';
import { useMarkupInstance } from './hooks';

const MarkupNode = () => {
  const isPresentationMode = React.useContext(PresentationModeContext);
  const nodeEntity = React.useContext(NodeEntityContext)!;
  const instance = useMarkupInstance<HTMLDivElement>();
  const getManager = React.useContext(ManagerContext)!;
  const engine = React.useContext(EngineContext)!;
  const observer = React.useMemo(() => new ResizeObserver(() => engine.transformation.reinitialize()), []);
  const { node, data, isFocused } = nodeEntity.useState((e) => {
    const resolved = e.resolve();

    return {
      node: resolved.node,
      data: resolved.data,
      isFocused: e.isFocused,
    };
  });
  const { markupNode: NodeComponent } = getManager(nodeEntity.nodeType)!;

  // for optimization reason using query selector to filter click events if markup is not opened
  const skipClick = React.useCallback(() => !document.getElementsByClassName(CANVAS_MARKUP_ENABLED).length, []);

  const { onMouseDown } = useNodeDrag({ skipClick });

  // TODO: implement context menu
  const onRightClick = React.useCallback(_noop, []);

  nodeEntity.useInstance(instance);

  useSetup(() => {
    if (isFocused) {
      instance.ref.current?.focus();
      engine.transformation.initialize(nodeEntity.nodeID);
    }
  });

  React.useEffect(() => {
    const transformEl = instance.transformRef.current!;
    observer.observe(transformEl);

    return () => observer.unobserve(transformEl);
  }, []);

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
            <NodeComponent node={node} data={data as NodeData<Markup.NodeData>} ref={instance.transformRef} />
          </ChildContainer>
        )}
      </Container>
    </>
  );
};

export default React.memo(MarkupNode);
