import * as Normal from 'normal-store';
import React from 'react';

import { Context } from '../context';
import manager from '../manager';
import Backdrop from './Backdrop';

const Placeholder = React.memo(() => {
  const { state, animated } = React.useContext(Context);

  const modalsToRender = Normal.denormalize(state)
    .map((modal) => [modal, manager.get(modal.type)] as const)
    .filter((tuple): tuple is [typeof tuple[0], NonNullable<typeof tuple[1]>] => !!tuple[1]);

  const visibleModal = modalsToRender[0]?.[0];

  return (
    <>
      {!!visibleModal && (
        <Backdrop
          onClose={() => manager.close(visibleModal.id, visibleModal.type)}
          closing={modalsToRender.length === 1 && visibleModal.closing}
          closePrevented={visibleModal?.closePrevented}
        />
      )}

      {modalsToRender.map(([modal, Component], index) => (
        <Component
          {...modal.props}
          id={modal.id}
          key={modal.key}
          api={modal.api as any}
          type={modal.type}
          opened={!modal.closing}
          hidden={index !== 0}
          rendered
          animated={animated && (!modal.reopened || modal.closing)}
          closePrevented={modal.closePrevented}
        />
      ))}
    </>
  );
});

export default Placeholder;
