import { useConst } from '@voiceflow/ui';
import React from 'react';

import type { HSLShades } from '@/constants';
import type { ChipApiRef } from '@/pages/Canvas/components/Chip';
import { NodeEntityContext } from '@/pages/Canvas/contexts';
import type { ChipAPI, CombinedAPI } from '@/pages/Canvas/types';

interface ChipStepRef<T extends HTMLElement = HTMLElement> extends CombinedAPI<T> {
  apiRef: React.RefObject<ChipApiRef>;
}

export const useChipApi = <T extends HTMLElement = HTMLElement>(ref: React.RefObject<T>) => {
  const apiRef = React.useRef<ChipApiRef>(null);

  return useConst<ChipStepRef<T>>({
    ref,
    apiRef,

    rename: () => apiRef.current?.rename(),
    getRect: () => ref.current?.getBoundingClientRect() ?? null,
    addEventListener: (event, listener) => ref.current?.addEventListener(event, listener),
    removeEventListener: (event, listener) => ref.current?.removeEventListener(event, listener),
  });
};

export interface ChipStepAPIProps<T extends HTMLElement = HTMLElement> {
  ref: React.RefObject<T>;
  name: string;
  nodeID: string;
  apiRef: React.RefObject<ChipApiRef>;
  palette: HSLShades;
  onClick?: React.MouseEventHandler<HTMLElement>;
  onRename: (name: string) => void;
  isDisabled?: boolean;
  onMouseMove?: React.MouseEventHandler<HTMLElement>;
  onMouseDown?: React.MouseEventHandler<HTMLElement>;
  onMouseEnter?: React.MouseEventHandler<HTMLElement>;
  onMouseLeave?: React.MouseEventHandler<HTMLElement>;
}

export const useChipStepAPI = <T extends HTMLElement>({
  ref,
  name,
  nodeID,
  apiRef,
  palette,
  onClick,
  onRename,
  isDisabled,
  onMouseMove,
  onMouseDown,
  onMouseEnter,
  onMouseLeave,
}: ChipStepAPIProps<T>) => {
  const nodeEntity = React.useContext(NodeEntityContext)!;

  const { lockOwner } = nodeEntity.useState((e) => ({
    lockOwner: e.lockOwner,
  }));

  return React.useMemo<ChipAPI<T>>(
    () => ({
      ref,
      name,
      nodeID,
      apiRef,
      palette,
      onRename,
      withPort: true,
      lockOwner,
      isDisabled,
      handlers: {
        onClick,
        onMouseMove,
        onMouseDown,
        onMouseEnter,
        onMouseLeave,
      },
    }),
    [lockOwner, palette, nodeID, onClick, onRename, isDisabled, onMouseMove, onMouseDown, onMouseEnter, onMouseLeave]
  );
};
