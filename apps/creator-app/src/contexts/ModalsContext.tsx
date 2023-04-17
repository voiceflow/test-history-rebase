import { Utils } from '@voiceflow/common';
import { useContextApi } from '@voiceflow/ui';
import React from 'react';

import { ModalType } from '@/constants';

export interface ModalContextType<T extends object = object> {
  fade: boolean;
  open: (id: ModalType, data: object) => void;
  close: (id: ModalType) => void;
  toggle: (id: ModalType, data: object) => void;
  update: (id: ModalType, data: object) => void;
  openedId?: ModalType;
  modalData: T;
  stackModalIds: ModalType[];
}

export const ModalsContext = React.createContext<ModalContextType>({
  fade: false,
  open: Utils.functional.noop,
  close: Utils.functional.noop,
  update: Utils.functional.noop,
  toggle: Utils.functional.noop,
  modalData: {},
  stackModalIds: [],
});

export interface ModalStackFrame {
  id: ModalType;
  data: object;
}

export type ModalStack = ModalStackFrame[];

const prevStackIncludes = (stack: ModalStack, id: ModalType): boolean => stack.some((modal) => modal.id === id);

const updateStackElement = (stack: ModalStack, { id, data }: ModalStackFrame): ModalStack =>
  stack.map((modal) => (modal.id === id ? { id, data: { ...modal.data, ...data } } : modal));

const addToStack = (stack: ModalStack, { id, data }: ModalStackFrame): ModalStack => [{ id, data }, ...stack];

const deleteFromStack = (stack: ModalStack, id: ModalType): ModalStack => stack.filter((mid) => mid.id !== id);

const DEFAULT_DATA = {};

export const ModalsContextProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [stack, updateStack] = React.useState<ModalStack>([]);
  const prevStackRef = React.useRef(stack.length);
  const stackModalIds = React.useMemo(() => stack.map(({ id }) => id), [stack]);

  const open = React.useCallback(
    (id: ModalType, data: object) => updateStack((prevStack) => (prevStackIncludes(prevStack, id) ? stack : addToStack(prevStack, { id, data }))),
    []
  );
  const close = React.useCallback((id: ModalType) => updateStack((prevStack) => deleteFromStack(prevStack, id)), [updateStack]);

  const toggle = React.useCallback(
    (id: ModalType, data: object) =>
      updateStack((prevStack) => (prevStackIncludes(prevStack, id) ? deleteFromStack(prevStack, id) : addToStack(prevStack, { id, data }))),
    []
  );

  const update = React.useCallback((id: ModalType, data: object) => updateStack((prevStack) => updateStackElement(prevStack, { id, data })), []);

  React.useEffect(() => {
    prevStackRef.current = stack.length;
  }, [stack.length]);

  const api = useContextApi({
    fade: stack.length <= 1 && prevStackRef.current <= 1,
    open,
    close,
    toggle,
    update,
    openedId: stack[0]?.id,
    modalData: stack[0]?.data || DEFAULT_DATA,
    stackModalIds,
  });

  return <ModalsContext.Provider value={api}>{children}</ModalsContext.Provider>;
};
