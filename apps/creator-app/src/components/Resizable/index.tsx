import type { Nullable } from '@voiceflow/common';
import { Utils } from '@voiceflow/common';
import { swallowEvent, useSetup } from '@voiceflow/ui';
import React from 'react';

import { useRAF, useResizeObserver } from '@/hooks';

import type { PanelPropsInjected } from './components';
import { Container } from './components';

export { Divider as ResizableDivider, Panel as ResizablePanel } from './components';

interface ResizableProps {
  children: React.ReactElement<PanelPropsInjected & React.RefAttributes<HTMLDivElement>>[];
  onResized?: (heights: number[]) => void;
  onResizeEnd?: () => void;
  renderDivider?: (props: { onDividerMouseDown: (event: React.MouseEvent<HTMLDivElement>) => void }) => React.ReactNode;
  onResizeStart?: () => void;
}

const Resizable = ({
  children,
  onResized,
  renderDivider,
  onResizeEnd,
  onResizeStart,
}: ResizableProps): React.ReactElement<any, any> => {
  const heightsRef = React.useRef<number[]>([]);
  const childrenRefs = React.useRef<Record<number, Nullable<HTMLDivElement>>>({});
  const containerRef = React.useRef<HTMLDivElement>(null);

  const [updateStylesScheduler] = useRAF();
  const [rendered, setRendered] = React.useState(false);
  const [containerHeight, setContainerHeight] = React.useState(0);
  const [collapsedChildren, setCollapsedChildren] = React.useState<boolean[]>([]);

  const childrenCount = React.Children.count(children);

  const getOnResizeByIndex = (index: number, clientY: number) => {
    const nextNode = childrenRefs.current[index + 1];
    const currentNode = childrenRefs.current[index];
    const nextChildren = children[index + 1];
    const currentChildren = children[index];
    const initialNextHeight = heightsRef.current[index + 1];
    const initialNextHeightPX = (heightsRef.current[index + 1] / 100) * containerHeight;
    const initialCurrentHeight = heightsRef.current[index];
    const initialCurrentHeightPX = (heightsRef.current[index] / 100) * containerHeight;

    let prevNextCollapsed = collapsedChildren[index + 1] ?? false;
    let prevCurrentCollapsed = collapsedChildren[index];

    // eslint-disable-next-line sonarjs/cognitive-complexity
    return (currentClientY: number): void => {
      const diffPX = currentClientY - clientY;
      const diff = (diffPX / containerHeight) * 100;
      const nextHeight = initialNextHeight - diff;
      const nextHeightPX = containerHeight * (nextHeight / 100);
      const currentHeight = initialCurrentHeight + diff;
      const currentHeightPX = containerHeight * (currentHeight / 100);

      const canResizeNext = nextNode && nextChildren && nextHeightPX >= (nextChildren.props.minHeight ?? 0);
      const canResizeCurrent =
        currentNode && currentChildren && currentHeightPX >= (currentChildren.props.minHeight ?? 0);

      let nextMaxHeightStyle: Nullable<number> = null;
      let currentMaxHeightStyle: Nullable<number> = null;

      if (canResizeNext && canResizeCurrent) {
        heightsRef.current[index] = currentHeight;
        heightsRef.current[index + 1] = nextHeight;

        nextMaxHeightStyle = nextHeight;
        currentMaxHeightStyle = currentHeight;

        if (prevCurrentCollapsed) {
          prevCurrentCollapsed = false;
          setCollapsedChildren((prevCollapsedChildren) =>
            Utils.array.replace(prevCollapsedChildren, index, prevCurrentCollapsed)
          );
        } else if (prevNextCollapsed) {
          prevNextCollapsed = false;
          setCollapsedChildren((prevCollapsedChildren) =>
            Utils.array.replace(prevCollapsedChildren, index + 1, prevNextCollapsed)
          );
        }
      } else if (!canResizeCurrent && !prevCurrentCollapsed) {
        if (currentNode && nextNode) {
          const minDiffPX = initialCurrentHeightPX - (currentChildren.props.minHeight ?? 0);
          const minDiff = (minDiffPX / containerHeight) * 100;
          const nextMinHeight = initialNextHeight + minDiff;
          const currentMinHeight = initialCurrentHeight - minDiff;

          heightsRef.current[index] = currentHeight;
          heightsRef.current[index + 1] = nextHeight;

          nextMaxHeightStyle = nextMinHeight;
          currentMaxHeightStyle = currentMinHeight;
        }

        prevCurrentCollapsed = true;
        setCollapsedChildren((prevCollapsedChildren) =>
          Utils.array.replace(prevCollapsedChildren, index, prevCurrentCollapsed)
        );
      } else if (!canResizeNext && !prevNextCollapsed) {
        if (currentNode && nextNode) {
          const minDiffPX = initialNextHeightPX - (nextChildren.props.minHeight ?? 0);
          const minDiff = (minDiffPX / containerHeight) * 100;
          const nextMinHeight = initialNextHeight - minDiff;
          const currentMinHeight = initialCurrentHeight + minDiff;

          heightsRef.current[index] = currentHeight;
          heightsRef.current[index + 1] = nextHeight;

          nextMaxHeightStyle = nextMinHeight;
          currentMaxHeightStyle = currentMinHeight;
        }

        prevNextCollapsed = true;
        setCollapsedChildren((prevCollapsedChildren) =>
          Utils.array.replace(prevCollapsedChildren, index + 1, prevNextCollapsed)
        );
      }

      updateStylesScheduler(() => {
        if (nextNode && currentNode && nextMaxHeightStyle !== null && currentMaxHeightStyle !== null) {
          nextNode.style.maxHeight = `${nextMaxHeightStyle}%`;
          currentNode.style.maxHeight = `${currentMaxHeightStyle}%`;
        }
      });
    };
  };

  const onDividerMouseDown = (index: number, { clientY, currentTarget }: React.MouseEvent<HTMLDivElement>): void => {
    onResizeStart?.();

    const onResize = getOnResizeByIndex(index, clientY);

    const onMouseMove = ({ clientY: currentClientY }: MouseEvent) => onResize(currentClientY);

    const onMouseUp = (): void => {
      onResizeEnd?.();
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
    setCollapsedChildren(
      heightsRef.current.map(
        (height, index) => (children[index].props.minHeight ?? 0) >= Math.ceil(containerHeight * (height / 100))
      )
    );
  };

  const setChildrenHeight = (index: number) => (height: number) => {
    const prevNodeHeightPX = (heightsRef.current[index - 1] / 100) * containerHeight;
    const currentNodeHeightPX = (heightsRef.current[index] / 100) * containerHeight;

    getOnResizeByIndex(index - 1, prevNodeHeightPX)(prevNodeHeightPX - (height - currentNodeHeightPX));

    onResized?.([...heightsRef.current]);
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
              height: heightsRef.current[index],
              innerRef: (node: HTMLDivElement | null) => {
                childrenRefs.current[index] = node;
              },
              setHeight: setChildrenHeight(index),
              collapsed: collapsedChildren[index],
              withDivider: index !== childrenCount - 1,
              renderDivider,
              onDividerMouseDown: swallowEvent<React.MouseEvent<HTMLDivElement>>((event) =>
                onDividerMouseDown(index, event)
              ),
            })}
          </React.Fragment>
        ))}
    </Container>
  );
};

export default Resizable;
