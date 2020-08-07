import React from 'react';

import { useRegistration, useTeardown } from '@/hooks';
import { HeadMarker, Path, buildHeadMarker, buildPath, getVirtualPoints } from '@/pages/Canvas/components/Link';
import { EngineContext } from '@/pages/Canvas/contexts';

import { Container } from './components';
import { useNewLinkAPI } from './hooks';

const NEW_LINK_ID = 'newLink';
const HEAD_MARKER = buildHeadMarker(NEW_LINK_ID);

const NewLink: React.FC = () => {
  const engine = React.useContext(EngineContext)!;
  const api = useNewLinkAPI<SVGPathElement>();
  const points = api.getPoints();

  useRegistration(() => engine.linkCreation.register('newLink', api), [api]);
  useTeardown(() => api.hide(), [api.hide]);

  if (!points || !api.isVisible) return null;

  const path = buildPath(getVirtualPoints(points))!;

  return (
    <Container>
      <HeadMarker id={NEW_LINK_ID} isHighlighted />
      <Path d={path} markerEnd={HEAD_MARKER} ref={api.ref} isHighlighted />
    </Container>
  );
};

export default React.memo(NewLink);
