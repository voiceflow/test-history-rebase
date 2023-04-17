import customEvent from './customEvent';

const dndSimulator = async (source: string | HTMLElement, target: string | HTMLElement, iterateBy = 2): Promise<void> => {
  const sourceElement = typeof source === 'string' ? document.querySelector<HTMLElement>(source)! : source;
  const targetElement = typeof target === 'string' ? document.querySelector<HTMLElement>(target)! : target;

  const sourceRect = sourceElement.getBoundingClientRect();
  const targetRect = targetElement.getBoundingClientRect();

  const sourceClientX = sourceRect.left + sourceRect.width / 2;
  const sourceClientY = sourceRect.top + sourceRect.height / 2;
  const targetClientX = targetRect.left + targetRect.width / 2;
  const targetClientY = targetRect.top + targetRect.height / 2;

  const dataTransfer = new DataTransfer();
  dataTransfer.dropEffect = 'move';
  dataTransfer.effectAllowed = 'all';

  const hoverEvent = customEvent('hover', { clientX: sourceClientX, clientY: sourceClientY });
  sourceElement.dispatchEvent(hoverEvent);

  const mouseDownEvent = customEvent('mousedown', { clientX: sourceClientX, clientY: sourceClientY });
  sourceElement.dispatchEvent(mouseDownEvent);

  const dragStartEvent = customEvent('dragstart', { clientX: sourceClientX, clientY: sourceClientY, dataTransfer });
  sourceElement.dispatchEvent(dragStartEvent);

  let dragTop = sourceClientY;
  let dragLeft = sourceClientX;
  const reverseTop = targetClientY < sourceClientY;
  const reverseLeft = targetClientX < sourceClientX;
  const iterateTopBy = iterateBy * (reverseTop ? -1 : 1);
  const iterateLeftBy = iterateBy * (reverseLeft ? -1 : 1);

  await new Promise<void>((resolve) => {
    const iterate = () => {
      if ((reverseTop ? dragTop > targetClientY : dragTop < targetClientY) && (reverseLeft ? dragLeft > targetClientX : dragLeft < targetClientX)) {
        const dragEvent = customEvent('drag', { clientX: sourceClientX, clientY: sourceClientY });
        sourceElement.dispatchEvent(dragEvent);

        dragTop += iterateTopBy;
        dragLeft += iterateLeftBy;

        requestAnimationFrame(iterate);
      } else {
        resolve();
      }
    };

    iterate();
  });

  const dragEnterEvent = customEvent('dragenter', { clientX: targetClientX, clientY: targetClientY, dataTransfer });
  targetElement.dispatchEvent(dragEnterEvent);

  const dragOverEvent = customEvent('dragover', { clientX: targetClientX, clientY: targetClientY, dataTransfer });
  targetElement.dispatchEvent(dragOverEvent);

  const dropEvent = customEvent('drop', { clientX: targetClientX, clientY: targetClientY, dataTransfer });
  targetElement.dispatchEvent(dropEvent);

  const dragEndEvent = customEvent('dragend', { clientX: targetClientX, clientY: targetClientY, dataTransfer });
  sourceElement.dispatchEvent(dragEndEvent);

  const mouseUpEvent = customEvent('mouseup', { clientX: targetClientX, clientY: targetClientY });
  targetElement.dispatchEvent(mouseUpEvent);
};

export default dndSimulator;
