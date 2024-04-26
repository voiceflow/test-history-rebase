export const styleSelectionElement = (
  selectionEl: HTMLElement,
  left: number,
  top: number,
  width: number,
  height: number
) => {
  selectionEl.style.left = `${left}px`;
  selectionEl.style.top = `${top}px`;
  selectionEl.style.width = `${width}px`;
  selectionEl.style.height = `${height}px`;
  selectionEl.style.display = width === 0 && height === 0 ? 'none' : 'block';
};
