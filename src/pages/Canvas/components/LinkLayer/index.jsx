import React from 'react';

import { allLinkIDsSelector } from '@/ducks/creator';
import { compose, connect } from '@/hocs';
import Link from '@/pages/Canvas/components/Link';
import LinkHeadMarker from '@/pages/Canvas/components/Link/components/LinkHeadMarker';
import { LinkIDProvider } from '@/pages/Canvas/contexts';

import LinkLayerSvg from './components/LinkLayerSvg';
import NewLink from './components/NewLink';

const LinkLayer = ({ linkIDs }) => (
  <LinkLayerSvg shapeRendering="geometricPrecision">
    <defs>
      <LinkHeadMarker />
    </defs>
    {linkIDs.map((linkID) => (
      <LinkIDProvider value={linkID} key={linkID}>
        <Link />
      </LinkIDProvider>
    ))}
    <NewLink />
  </LinkLayerSvg>
);

const mapStateToProps = {
  linkIDs: allLinkIDsSelector,
};

export default compose(connect(mapStateToProps, null, null, { forwardRef: true }), React.memo)(LinkLayer);
