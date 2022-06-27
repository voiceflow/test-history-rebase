import React from 'react';

export interface ResizeManagerOptions {
  axis?: 'x' | 'y' | 'both';
  disabled?: boolean;
  minWidth?: number;
  maxWidth?: number;
  minHeight?: number;
  maxHeight?: number;
  width?: number;
  height?: number;
  onResize?: (dimensions: [number, number]) => void;
  onResizeStart?: VoidFunction;
  onResizeEnd?: (dimensions: [number, number]) => void;
}

export class ResizeManager {
  private axis: 'x' | 'y' | 'both';

  private mouseDownX?: number;

  private mouseDownY?: number;

  private diffX?: number;

  private diffY?: number;

  private currentTarget?: HTMLDivElement;

  private width?: number;

  private height?: number;

  private tmpWidth?: number;

  private tmpHeight?: number;

  private maxWidth?: number;

  private minWidth: number;

  private maxHeight?: number;

  private minHeight: number;

  public isResizing: boolean;

  private disabled: boolean;

  private onResize: ResizeManagerOptions['onResize'];

  private onResizeStart: ResizeManagerOptions['onResizeStart'];

  private onResizeEnd: ResizeManagerOptions['onResizeEnd'];

  constructor(options: ResizeManagerOptions) {
    this.axis = options.axis ?? 'x';

    this.width = options.width;
    this.height = options.height;
    this.maxWidth = options.maxWidth;
    this.minWidth = options.minWidth ?? 0;
    this.maxHeight = options.maxHeight;
    this.minHeight = options.minHeight ?? 0;
    this.disabled = !!options.disabled;

    this.tmpWidth = options.width;
    this.tmpHeight = options.height;

    this.isResizing = false;

    this.onResize = options.onResize;
    this.onResizeStart = options.onResizeStart;
    this.onResizeEnd = options.onResizeEnd;

    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
    this.onMouseUp = this.onMouseUp.bind(this);
  }

  setWidth(width: number) {
    this.width = width;
  }

  setHeight(width: number) {
    this.width = width;
  }

  setDisabled(disabled: boolean) {
    this.disabled = disabled;
  }

  onMouseDown({ clientY, clientX, currentTarget }: React.MouseEvent<HTMLDivElement>) {
    if (this.disabled) return;

    this.onResizeStart?.();
    this.isResizing = true;
    this.currentTarget = currentTarget;
    this.mouseDownY = clientY;
    this.mouseDownX = clientX;

    currentTarget.classList.add('resizing');
    currentTarget.parentElement?.classList.add('resizing');
    document.addEventListener('mousemove', this.onMouseMove);
    document.addEventListener('mouseup', this.onMouseUp);
  }

  onMouseUp() {
    this.isResizing = false;
    this.width = this.tmpWidth;
    this.height = this.tmpHeight;

    this.onResizeEnd?.([this.width!, this.height!]);

    this.currentTarget?.parentElement?.classList.remove('resizing');
    this.currentTarget?.classList.remove('resizing');
    document.removeEventListener('mousemove', this.onMouseMove);
    document.removeEventListener('mouseup', this.onMouseUp);
  }

  onMouseMove({ clientY, clientX }: MouseEvent) {
    if (!this.mouseDownX || !this.mouseDownY) return;

    this.diffX = clientX - this.mouseDownX;
    this.diffY = clientY - this.mouseDownY;

    const dimensions: Partial<{ width: number; height: number }> = {};

    if (['both', 'x'].includes(this.axis)) {
      const newWidth = this.getNewWidth(this.diffX, this.width);
      if (newWidth !== this.tmpWidth) {
        dimensions.width = newWidth;
        this.tmpWidth = newWidth;
      }
    }

    if (['both', 'y'].includes(this.axis)) {
      const newHeight = this.getNewHeight(this.diffY, this.height);
      if (newHeight !== this.tmpHeight) {
        dimensions.height = newHeight;
        this.tmpHeight = newHeight;
      }
    }

    if (dimensions.height === undefined && dimensions.width === undefined) return;

    this.onResize?.([this.tmpWidth!, this.tmpHeight!]);
  }

  getNewWidth(diffX: number, width?: number) {
    const newWidth = (width ?? 0) + diffX;
    // making sure new width does not go out of bounds
    return Math.min(Math.max(this.minWidth, newWidth), this.maxWidth ?? Number.MAX_SAFE_INTEGER);
  }

  getNewHeight(diffY: number, height?: number) {
    const newHeight = (height ?? 0) + diffY;
    // making sure new height does not go out of bounds
    return Math.min(Math.max(this.minHeight, newHeight), this.maxHeight ?? Number.MAX_SAFE_INTEGER);
  }
}

export const useResizeManager = (options: ResizeManagerOptions) => {
  const ref = React.useRef<ResizeManager>();

  if (!ref.current) {
    ref.current = new ResizeManager(options);
  }

  React.useEffect(() => {
    ref.current?.setDisabled(!!options.disabled);
  }, [options.disabled]);

  return ref.current;
};
