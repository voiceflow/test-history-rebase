import * as Normal from 'normal-store';
import React, { memo, useContext, useMemo } from 'react';
import type { DeepNonNullable } from 'utility-types';

import { Context as ModalsContext } from '@/ModalsV2/context';
import { modalsManager } from '@/ModalsV2/manager';

import { ModalBackdrop } from '../ModalBackdrop/ModalBackdrop.component';

export const ModalPlaceholder = memo(() => {
  const { state, animated } = useContext(ModalsContext);

  const modalsToRender = useMemo(
    () =>
      Normal.denormalize(state)
        .map((modal) => ({ modal, Component: modalsManager.get(modal.type) }))
        .filter((data): data is DeepNonNullable<typeof data> => !!data.Component),
    [state]
  );

  const visibleModal = modalsToRender[0]?.modal;

  return (
    <>
      {!!visibleModal && (
        <ModalBackdrop
          onClick={() => modalsManager.close(visibleModal.id, visibleModal.type)}
          closing={modalsToRender.length === 1 && visibleModal.closing}
          closePrevented={visibleModal?.closePrevented}
        />
      )}

      {modalsToRender.map(({ modal, Component }, index) => (
        <Component
          {...modal.props}
          id={modal.id}
          key={modal.key}
          api={modal.api as any}
          type={modal.type}
          opened={!modal.closing}
          hidden={index !== 0}
          animated={animated && (!modal.reopened || modal.closing)}
          closePrevented={modal.closePrevented}
        />
      ))}
    </>
  );
});
