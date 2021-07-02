import React from 'react';
import { Transition, TransitionStatus } from 'react-transition-group';

import { css, styled, transition } from '../../styles';

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

const Collapse: React.FC<{ isOpen: boolean }> = ({ children, isOpen }) => {
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
    <Transition in={isOpen} onEntering={onHeight} onEntered={onFinished} onExit={onHeight} onExiting={onExiting} onExited={onFinished} timeout={500}>
      {(status) => {
        return (
          <CollapseContainer
            status={status}
            style={{
              height,
            }}
          >
            <div>{children}</div>
          </CollapseContainer>
        );
      }}
    </Transition>
  );
};

export default Collapse;
