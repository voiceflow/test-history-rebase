import React from 'react';

import Link from '@/containers/CanvasV2/components/Link';
import LinkHeadMarker from '@/containers/CanvasV2/components/Link/components/LinkHeadMarker';
import { LinkIDProvider } from '@/containers/CanvasV2/contexts';
import { allLinkIDsSelector } from '@/ducks/creator';
import { connect } from '@/hocs';

import LinkLayerSvg from './LinkLayerSvg';
import NewLink from './NewLink';

const LinkLayer = ({ renderLinks, linkIDs }) => (
  <LinkLayerSvg>
    <defs>
      <LinkHeadMarker />
    </defs>
    {renderLinks &&
      linkIDs.map((linkID) => (
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

export default connect(
  mapStateToProps,
  null,
  null,
  { forwardRef: true }
)(LinkLayer);
