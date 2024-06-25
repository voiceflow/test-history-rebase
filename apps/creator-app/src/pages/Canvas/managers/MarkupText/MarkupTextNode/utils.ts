export const findAllDraggableParents = (node?: HTMLElement | null): HTMLElement[] => {
  const parent = node?.closest<HTMLElement>('[draggable="true"]');

  if (parent) {
    return parent.parentElement ? [parent, ...findAllDraggableParents(parent.parentElement)] : [parent];
  }

  return [];
};

export const addDraggableAttr = (nodes?: HTMLElement[]) =>
  nodes?.forEach((parentNode) => parentNode.setAttribute('draggable', 'true'));

export const removeDraggableAttr = (nodes?: HTMLElement[]) =>
  nodes?.forEach((parentNode) => parentNode.removeAttribute('draggable'));
