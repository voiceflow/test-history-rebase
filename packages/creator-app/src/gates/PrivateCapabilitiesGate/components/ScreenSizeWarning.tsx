import { PageError } from '@voiceflow/ui';
import React from 'react';

import { screenSize } from '@/assets';
import { styled } from '@/hocs/styled';

const BlockingPage = styled.div`
  display: none;

  @media (max-width: 900px) {
    display: block;
    height: 100%;
    width: 100%;
    position: fixed;
    z-index: 1005;
    background: #f9f9f9bf;
    backdrop-filter: blur(5px);
  }
`;

const ScreenSizeWarning: React.FC = () => (
  <BlockingPage>
    <PageError
      icon={<img src={screenSize} alt="" width={80} />}
      title="Your browser is too small"
      message="Resize your browser to at least 900px wide to continue."
    ></PageError>
  </BlockingPage>
);

export default ScreenSizeWarning;
