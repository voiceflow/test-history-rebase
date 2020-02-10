import React from 'react';

import { diagramByIDSelector } from '@/ducks/diagram';
import { connect } from '@/hocs';
import EnterFlow from '@/pages/Canvas/components/EnterFlow';

import CombinedBlockContent from './CombinedBlockContent';

const CombinedBlockEnterFlow = ({ diagram, children }) => {
  if (!diagram) {
    return null;
  }

  return (
    <CombinedBlockContent fullWidth>
      <EnterFlow diagramID={diagram.id} />
      {children}
    </CombinedBlockContent>
  );
};

const mapStateToProps = {
  diagram: diagramByIDSelector,
};

const mergeProps = ({ diagram: getDiagramByID }, _, { diagramID }) => ({
  diagram: diagramID && getDiagramByID(diagramID),
});

export default connect(mapStateToProps, null, mergeProps)(CombinedBlockEnterFlow);
