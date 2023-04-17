import React from 'react';

import * as CreatorV2 from '@/ducks/creatorV2';
import { useSelector } from '@/hooks';
import Link, { HeadMarker } from '@/pages/Canvas/components/Link';
import NewLink from '@/pages/Canvas/components/NewLink';
import { LinkEntityProvider } from '@/pages/Canvas/contexts';

import LinkLayerSvg from './components/LinkLayerSvg';

const LinkLayer: React.FC = () => {
  const linkIDs = useSelector(CreatorV2.allLinkIDsSelector);

  return (
    <LinkLayerSvg shapeRendering="geometricPrecision">
      <defs>
        <HeadMarker />
      </defs>

      {linkIDs.map((linkID) => (
        <LinkEntityProvider id={linkID} key={linkID}>
          <Link />
        </LinkEntityProvider>
      ))}

      <NewLink />
    </LinkLayerSvg>
  );
};

export default React.memo(LinkLayer);
