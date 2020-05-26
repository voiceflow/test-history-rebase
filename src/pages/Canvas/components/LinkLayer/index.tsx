import React from 'react';

import { allLinkIDsSelector } from '@/ducks/creator';
import { connect } from '@/hocs';
import Link, { HeadMarker } from '@/pages/Canvas/components/Link';
import NewLink from '@/pages/Canvas/components/NewLink';
import { LinkEntityProvider } from '@/pages/Canvas/contexts';
import { ConnectedProps } from '@/types';

import LinkLayerSvg from './components/LinkLayerSvg';

const LinkLayer: React.FC<ConnectedLinkLayerProps> = ({ linkIDs }) => (
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

const mapStateToProps = {
  linkIDs: allLinkIDsSelector,
};

type ConnectedLinkLayerProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(LinkLayer);
