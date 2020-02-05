import React from 'react';

export const ModalsContext = React.createContext();

const prevStackIncludes = (stack, id) => {
  return !!stack.some((modal) => {
    return modal.id === id;
  });
};

const updateStackElement = (stack, { id, data }) =>
  stack.map((modal) => {
    if (modal.id === id) return { id, data: { ...modal.data, ...data } };
    return modal;
  });
const addToStack = (stack, { id, data }) => [{ id, data }, ...stack];
const deleteFromStack = (stack, id) => stack.filter((mid) => mid.id !== id);

export const ModalsContextProvider = ({ children }) => {
  const [stack, updateStack] = React.useState([]);
  const prevStackRef = React.useRef(stack.length);

  const open = React.useCallback(
    (id, data) => updateStack((prevStack) => (prevStackIncludes(prevStack, id) ? stack : addToStack(prevStack, { id, data }))),
    [updateStack]
  );
  const close = React.useCallback((id) => updateStack((prevStack) => deleteFromStack(prevStack, id)), [updateStack]);
  const toggle = React.useCallback(
    (id, data) =>
      updateStack((prevStack) => (prevStackIncludes(prevStack, id) ? deleteFromStack(prevStack, id) : addToStack(prevStack, { id, data }))),
    [updateStack]
  );

  const update = React.useCallback((id, data) => updateStack((prevStack) => updateStackElement(prevStack, { id, data })), [updateStack]);

  React.useEffect(() => {
    prevStackRef.current = stack.length;
  }, [stack.length]);

  return (
    <ModalsContext.Provider
      value={{
        fade: stack.length <= 1 && prevStackRef.current <= 1,
        open,
        close,
        toggle,
        update,
        openedId: stack[0]?.id,
        modalData: stack[0]?.data || {},
      }}
    >
      {children}
    </ModalsContext.Provider>
  );
};

export const useModals = (modalId) => {
  const { fade, open, close, update, toggle, openedId, modalData } = React.useContext(ModalsContext) || {};

  const isOpened = openedId === modalId;
  const cacheState = React.useRef({ opened: openedId === modalId });

  const closeModal = React.useCallback(() => close(modalId), [close, modalId]);
  const updateModal = React.useCallback((data = {}) => update(modalId, data), [update, modalId]);

  const openModal = React.useCallback(
    (data = {}, onClose) => {
      cacheState.current.onClose = onClose;
      open(modalId, data, onClose);
    },
    [open, modalId]
  );
  const toggleModal = React.useCallback(
    (data = {}, onClose) => {
      cacheState.current.onClose = onClose;

      toggle(modalId, data, onClose);
    },
    [toggle, modalId]
  );

  React.useEffect(() => {
    if (!isOpened && cacheState.current.isOpened) {
      cacheState.current.onClose?.();
    }

    cacheState.current.isOpened = isOpened;
  }, [isOpened]);

  return {
    fade,
    data: modalData,
    open: openModal,
    close: closeModal,
    toggle: toggleModal,
    update: updateModal,
    isOpened,
  };
};
