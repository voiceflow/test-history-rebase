import React from 'react';

import { styled } from '@/hocs';

import Display from './Display';
import Multimodal from './Multimodal';

const VisualsPageContainer = styled.div`
  display: flex;
  height: 100%;
  overflow-y: auto;
`;

const VisualsPageContent = styled.div`
  min-height: 100%;
  position: relative;
  flex: 1 1;
`;

function Visuals(props) {
  const { page: propPage } = props;

  let page;
  if (propPage === 'display') {
    page = <Display {...props} />;
  } else {
    page = <Multimodal {...props} />;
  }

  return (
    <VisualsPageContainer>
      <VisualsPageContent>{page}</VisualsPageContent>
    </VisualsPageContainer>
  );
}

export default Visuals;
