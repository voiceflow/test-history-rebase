import React from 'react';

import { allLinkIDsSelector } from '@/ducks/creator';
import { connect } from '@/hocs';
import Link from '@/pages/Canvas/components/Link';
import LinkHeadMarker from '@/pages/Canvas/components/Link/components/LinkHeadMarker';
import { LinkIDProvider } from '@/pages/Canvas/contexts';

import LinkLayerSvg from './components/LinkLayerSvg';
import NewLink from './components/NewLink';

const LinkLayer = ({ linkIDs }) => (
  <LinkLayerSvg>
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

export default connect(mapStateToProps, null, null, { forwardRef: true })(LinkLayer);
