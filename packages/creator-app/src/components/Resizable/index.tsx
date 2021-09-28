import composeRef from '@seznam/compose-react-refs';
import { Nullable } from '@voiceflow/common';
import { swallowEvent, useSetup } from '@voiceflow/ui';
import React from 'react';

import { useRAF, useResizeObserver } from '@/hooks';
import { replace } from '@/utils/array';

import { Container, PanelPropsInjected } from './components';

export { Panel as ResizablePanel } from './components';

interface ResizableProps {
  children: React.ReactElement<PanelPropsInjected & React.RefAttributes<HTMLDivElement>>[];
  onResized?: (heights: number[]) => void;
}

const Resizable = ({ children, onResized }: ResizableProps): React.ReactElement<any, any> => {
  const heightsRef = React.useRef<number[]>([]);
  const childrenRefs = React.useRef<Record<number, Nullable<HTMLDivElement>>>({});
  const containerRef = React.useRef<HTMLDivElement>(null);

  const [updateStylesScheduler] = useRAF();
  const [rendered, setRendered] = React.useState(false);
  const [containerHeight, setContainerHeight] = React.useState(0);
  const [collapsedChildren, setCollapsedChildren] = React.useState<boolean[]>([]);

  const childrenCount = React.Children.count(children);

  const onDividerMouseDown = (index: number, { clientY, currentTarget }: React.MouseEvent<HTMLDivElement>): void => {
    const nextNode = childrenRefs.current[index + 1];
    const currentNode = childrenRefs.current[index];
    const nextChildren = children[index + 1];
    const currentChildren = children[index];
    const initialNextHeight = heightsRef.current[index + 1];
    const initialCurrentHeight = heightsRef.current[index];

    let prevCollapsed = collapsedChildren[index];
    let prevNextCollapsed = collapsedChildren[index + 1] ?? false;

    const onMouseMove = ({ clientY: currentClientY }: MouseEvent): void => {
      updateStylesScheduler(() => {
        const diffPX = currentClientY - clientY;
        const diff = (diffPX / containerHeight) * 100;
        const nextHeight = initialNextHeight - diff;
        const nextHeightPX = containerHeight * (nextHeight / 100);
        const currentHeight = initialCurrentHeight + diff;
        const currentHeightPX = containerHeight * (currentHeight / 100);

        const canResizeNext = nextNode && nextChildren && nextHeightPX >= nextChildren.props.minHeight;
        const canResizeCurrent = currentNode && currentChildren && currentHeightPX >= currentChildren.props.minHeight;

        if (canResizeNext && canResizeCurrent) {
          if (prevCollapsed) {
            prevCollapsed = false;
            setCollapsedChildren((prevCollapsedChildren) => replace(prevCollapsedChildren, index, prevCollapsed));
          } else if (prevNextCollapsed) {
            prevNextCollapsed = false;
            setCollapsedChildren((prevCollapsedChildren) => replace(prevCollapsedChildren, index + 1, prevNextCollapsed));
          }

          heightsRef.current[index] = currentHeight;
          heightsRef.current[index + 1] = nextHeight;

          nextNode.style.maxHeight = `${nextHeight}%`;
          currentNode.style.maxHeight = `${currentHeight}%`;
        } else if (!canResizeCurrent && !prevCollapsed) {
          prevCollapsed = true;
          setCollapsedChildren((prevCollapsedChildren) => replace(prevCollapsedChildren, index, prevCollapsed));
        } else if (!canResizeNext && !prevNextCollapsed) {
          prevNextCollapsed = true;
          setCollapsedChildren((prevCollapsedChildren) => replace(prevCollapsedChildren, index + 1, prevNextCollapsed));
        }
      });
    };

    const onMouseUp = (): void => {
      onResized?.([...heightsRef.current]);

      currentTarget.classList.remove('resizing');

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    currentTarget.classList.add('resizing');

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const recalculateSizes = (): void => {
    const containerHeight = containerRef.current?.clientHeight ?? 0;
    const initialChildrenHeight = 100 / childrenCount;

    heightsRef.current = React.Children.map(children, (child) => child.props.height ?? initialChildrenHeight);

    setContainerHeight(containerHeight);
    setCollapsedChildren(heightsRef.current.map((height, index) => children[index].props.minHeight >= Math.ceil(containerHeight * (height / 100))));
  };

  useSetup(() => setRendered(true));
  useResizeObserver(containerRef, recalculateSizes);
  React.useLayoutEffect(recalculateSizes, [childrenCount]);

  return (
    <Container ref={containerRef}>
      {rendered &&
        React.Children.map(children, (child, index: number) => (
          <React.Fragment key={child.key || index}>
            {React.cloneElement(child, {
              ref: composeRef<HTMLDivElement>(child.props.ref, (node) => {
                childrenRefs.current[index] = node;
              }),
              height: heightsRef.current[index],
              collapsed: collapsedChildren[index],
              withDivider: index !== childrenCount - 1,
              onDividerMouseDown: swallowEvent<React.MouseEvent<HTMLDivElement>>((event) => onDividerMouseDown(index, event)),
            })}
          </React.Fragment>
        ))}
    </Container>
  );
};

export default Resizable;
