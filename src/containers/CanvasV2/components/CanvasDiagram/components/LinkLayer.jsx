import React from 'react';

import Link from '@/containers/CanvasV2/components/Link';
import LinkHeadMarker from '@/containers/CanvasV2/components/Link/components/LinkHeadMarker';
import { allLinkIDsSelector } from '@/ducks/creator';
import { connect } from '@/hocs';

import LinkLayerSvg from './LinkLayerSvg';
import NewLink from './NewLink';

const LinkLayer = ({ renderLinks, linkIDs }) => (
  <LinkLayerSvg>
    <defs>
      <LinkHeadMarker />
    </defs>
    {renderLinks && linkIDs.map((linkID) => <Link linkID={linkID} key={linkID} />)}
    <NewLink />
  </LinkLayerSvg>
);

const mapStateToProps = {
  linkIDs: allLinkIDsSelector,
};

export default connect(
  mapStateToProps,
  null,
  null,
  { forwardRef: true }
)(LinkLayer);
