import React from 'react';

import { useRegistration, useTeardown } from '@/hooks';
import {
  buildHeadMarker,
  buildPath,
  getMarkerAttrs,
  getPathPoints,
  getVirtualPoints,
  HeadMarker,
  Path,
  STROKE_DEFAULT_COLOR,
} from '@/pages/Canvas/components/Link';
import { EngineContext, IsStraightLinksContext } from '@/pages/Canvas/contexts';
import { Identifier } from '@/styles/constants';

import { Container } from './components';
import { useNewLinkAPI } from './hooks';

export const NEW_LINK_ID = 'newLink';
export const HEAD_MARKER = buildHeadMarker(NEW_LINK_ID);

const NewLink: React.FC = () => {
  const engine = React.useContext(EngineContext)!;
  const isStraightLinks = React.useContext(IsStraightLinksContext)!;

  const api = useNewLinkAPI<SVGPathElement>();
  const points = api.getSourceTargetPoints();

  useRegistration(() => engine.linkCreation.register('newLink', api), [api]);
  useTeardown(() => api.hide(), [api.hide]);

  const pathPoints = React.useMemo(() => getPathPoints(getVirtualPoints(points), { straight: isStraightLinks }), [points, isStraightLinks]);
  const path = React.useMemo(() => buildPath(pathPoints, isStraightLinks), [pathPoints, isStraightLinks]);
  const markerAttrs = React.useMemo(() => getMarkerAttrs(pathPoints, isStraightLinks), [pathPoints, isStraightLinks]);

  if (!points || !api.isVisible) return null;

  return (
    <Container>
      <HeadMarker id={NEW_LINK_ID} ref={api.markerRef} isHighlighted {...markerAttrs} />

      <Path d={path} id={Identifier.NEW_LINK} strokeColor={STROKE_DEFAULT_COLOR} markerEnd={HEAD_MARKER} ref={api.ref} isHighlighted />
    </Container>
  );
};

export default React.memo(NewLink);
