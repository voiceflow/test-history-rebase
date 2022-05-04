import { css, styled, transition } from '@ui/styles';
import React from 'react';
import { Transition, TransitionStatus } from 'react-transition-group';

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
  mountOnEnter?: boolean;
  unmountOnExit?: boolean;
}

const Collapse: React.FC<CollapseProps> = ({ isOpen, children, mountOnEnter, unmountOnExit, ...props }) => {
  const [height, setHeight] = React.useState<number | undefined>();

  const onHeight = React.useCallback((node: HTMLElement) => {
    setHeight(node.scrollHeight);
  }, []);

  const onFinished = React.useCallback(() => {
    setHeight(undefined);
  }, []);

  const onExiting = React.useCallback((node: HTMLElement) => {
    // getting this variable triggers a reflow
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const unused = node.offsetHeight; // eslint-disable-line @typescript-eslint/no-unused-vars
    setHeight(0);
  }, []);

  return (
    <Transition
      in={isOpen}
      onExit={onHeight}
      timeout={500}
      onExited={onFinished}
      onEntered={onFinished}
      onExiting={onExiting}
      onEntering={onHeight}
      mountOnEnter={mountOnEnter}
      unmountOnExit={unmountOnExit}
    >
      {(status) => (
        <CollapseContainer {...props} status={status} style={{ ...props.style, height }}>
          <div>{children}</div>
        </CollapseContainer>
      )}
    </Transition>
  );
};

export default Collapse;
