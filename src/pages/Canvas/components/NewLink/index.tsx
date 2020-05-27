import React from 'react';

import { useTeardown } from '@/hooks';
import { HeadMarker, Path, buildHeadMarker, buildPath } from '@/pages/Canvas/components/Link';
import { EngineContext } from '@/pages/Canvas/contexts';

import { Container } from './components';
import { getVirtualPoints, useNewLinkAPI } from './hooks';

const NEW_LINK_ID = 'newLink';
const HEAD_MARKER = buildHeadMarker(NEW_LINK_ID);

const NewLink: React.FC = () => {
  const engine = React.useContext(EngineContext)!;
  const api = useNewLinkAPI<SVGPathElement>();
  const points = api.getPoints();

  React.useEffect(() => {
    engine.linkCreation.registerNewLink(api);

    return () => {
      engine.linkCreation.registerNewLink(null);
    };
  }, [api]);

  useTeardown(() => api.removeEventListeners.current?.());

  if (!points || !api.isVisible) {
    return null;
  }

  const path = buildPath(getVirtualPoints(points));

  return (
    <Container>
      <HeadMarker id={NEW_LINK_ID} isHighlighted />
      <Path d={path} markerEnd={HEAD_MARKER} ref={api.ref} isHighlighted />
    </Container>
  );
};

export default React.memo(NewLink);
