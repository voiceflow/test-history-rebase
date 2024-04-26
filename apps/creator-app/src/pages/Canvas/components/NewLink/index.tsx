import React from 'react';

import { useRegistration, useTeardown } from '@/hooks';
import {
  buildHeadMarker,
  buildPath,
  getMarkerAttrs,
  getPathPoints,
  HeadMarker,
  Path,
  STROKE_DEFAULT_COLOR,
} from '@/pages/Canvas/components/Link';
import LinkStepMenu from '@/pages/Canvas/components/LinkStepMenu';
import { EngineContext, IsStraightLinksContext, LinkStepMenuContext } from '@/pages/Canvas/contexts';
import { useCanvasPan, useCanvasZoom } from '@/pages/Canvas/hooks/canvas';
import { Identifier } from '@/styles/constants';

import { Container } from './components';
import { useNewLinkAPI } from './hooks';

export const NEW_LINK_ID = 'newLink';
export const HEAD_MARKER = buildHeadMarker(NEW_LINK_ID);

const NewLink: React.FC = () => {
  const engine = React.useContext(EngineContext)!;
  const isStraight = React.useContext(IsStraightLinksContext)!;
  const stepMenuContext = React.useContext(LinkStepMenuContext)!;

  const api = useNewLinkAPI<SVGPathElement>();
  const linkedRects = api.getLinkedRects();

  useRegistration(() => engine.linkCreation.register('newLink', api), [api]);
  useTeardown(() => api.hide(), [api.hide]);

  const [path, markerAttrs] = React.useMemo(() => {
    if (linkedRects === null) return [null, null];

    const pathPoints = getPathPoints(linkedRects, {
      isStraight,
      isConnected: engine.linkCreation.hasPin,
      sourceNodeIsChip: engine.linkCreation.sourceNodeIsChip,
      sourceNodeIsStart: engine.linkCreation.sourceNodeIsStart,
      sourceNodeIsAction: engine.linkCreation.sourceNodeIsAction,
      targetNodeIsCombined: engine.linkCreation.targetNodeIsCombined,
      sourceParentNodeRect: engine.linkCreation.getSourceParentNodeRect(),
    });

    return [buildPath(pathPoints, { isStraight }), getMarkerAttrs(pathPoints, { isStraight })] as const;
  }, [linkedRects, isStraight, getPathPoints]);

  useCanvasPan(() => engine.linkCreation.blockViaLinkMenuHidden());
  useCanvasZoom(() => engine.linkCreation.blockViaLinkMenuHidden());

  if (path === null || !api.isVisible) return null;

  return (
    <Container>
      <HeadMarker
        id={NEW_LINK_ID}
        ref={api.markerRef}
        isHighlighted
        {...markerAttrs}
        blockViaLinkMode={stepMenuContext.isOpen}
      />

      <LinkStepMenu />

      <Path
        d={path}
        id={Identifier.NEW_LINK}
        strokeDasharray="6, 3"
        strokeColor={STROKE_DEFAULT_COLOR}
        markerEnd={HEAD_MARKER}
        ref={api.ref}
        isHighlighted
      />
    </Container>
  );
};

export default React.memo(NewLink);
