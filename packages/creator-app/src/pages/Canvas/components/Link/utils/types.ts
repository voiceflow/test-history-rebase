export interface LinkedRects {
  sourcePortRect: DOMRect;
  sourceNodeRect: DOMRect;
  targetPortRect: DOMRect;
  targetNodeRect: DOMRect;
}

export interface ExtendsLinkedRects extends LinkedRects {
  sourceParentNodeRect: DOMRect;
}
