import React from 'react';
import type { TransitionStatus } from 'react-transition-group';
import { Transition } from 'react-transition-group';

import { css, styled, transition } from '@/styles';

enum TransitionStatuses {
  ENTERING = 'entering',
  ENTERED = 'entered',
  EXITING = 'exiting',
  EXITED = 'exited',
}

const CollapseContainer = styled.div<{ status: TransitionStatus }>`
  ${({ status }) => {
    switch (status) {
      case TransitionStatuses.ENTERING:
      case TransitionStatuses.EXITING:
        return css`
          position: relative;
          height: 0;
          overflow: hidden;
          ${transition('height')}
        `;
      case TransitionStatuses.EXITED:
        return css`
          display: none;
        `;
      default:
        return false;
    }
  }}
`;

export interface CollapseProps extends React.HTMLAttributes<HTMLDivElement> {
  isOpen: boolean;
  onEntered?: VoidFunction;
  mountOnEnter?: boolean;
  unmountOnExit?: boolean;
}

const Collapse: React.ForwardRefRenderFunction<HTMLDivElement, CollapseProps> = (
  { isOpen, children, mountOnEnter, unmountOnExit, onEntered: onEnteredProp, ...props },
  ref
) => {
  const [height, setHeight] = React.useState<number | undefined>();

  const onHeight = (node: HTMLElement) => {
    setHeight(node.scrollHeight);
  };

  const onFinished = () => {
    setHeight(undefined);
  };

  const onEntered = () => {
    onFinished();
    onEnteredProp?.();
  };

  const onExiting = (node: HTMLElement) => {
    // getting this variable triggers a reflow
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const unused = node.offsetHeight; // eslint-disable-line @typescript-eslint/no-unused-vars
    setHeight(0);
  };

  return (
    <Transition
      in={isOpen}
      onExit={onHeight}
      timeout={500}
      onExited={onFinished}
      onEntered={onEntered}
      onExiting={onExiting}
      onEntering={onHeight}
      mountOnEnter={mountOnEnter}
      unmountOnExit={unmountOnExit}
    >
      {(status) => (
        <CollapseContainer {...props} ref={ref} status={status} style={{ ...props.style, height }}>
          <div>{children}</div>
        </CollapseContainer>
      )}
    </Transition>
  );
};

export default React.forwardRef(Collapse);
