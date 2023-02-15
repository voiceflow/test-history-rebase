import React from 'react';

import * as CreatorV2 from '@/ducks/creatorV2';
import { useSelector } from '@/hooks';
import MarkupNode from '@/pages/Canvas/components/MarkupNode';
import { NodeEntityProvider } from '@/pages/Canvas/contexts';

import { Container } from './components';

const MarkupLayer: React.FC = () => {
  const markupIDs = useSelector(CreatorV2.markupIDsSelector);

  return (
    <Container>
      {markupIDs.map((markupID) => (
        <NodeEntityProvider id={markupID} key={markupID}>
          <MarkupNode />
        </NodeEntityProvider>
      ))}
    </Container>
  );
};

export default React.memo(MarkupLayer);
