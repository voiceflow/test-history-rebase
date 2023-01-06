import { Link } from '@voiceflow/ui';
import React from 'react';

import { Identifier } from '@/styles/constants';

import { Container, ContentContainer } from '../common';
import { BoxLogo, WaterMark } from './components';

interface ShareSplashScreenProps {
  logoURL?: string;
  isMobile?: boolean;
  logoSize?: number;
  isVisuals?: boolean;
  centerAlign?: boolean;
  colorScheme?: string;
  hideVFBranding?: boolean;
}

const FullPageTemplate: React.OldFC<ShareSplashScreenProps> = ({
  colorScheme,
  isVisuals,
  isMobile,
  logoSize,
  logoURL,
  centerAlign,
  children,
  hideVFBranding,
}) => (
  <Container isVisuals={isVisuals} isMobile={isMobile}>
    <ContentContainer centerAlign={centerAlign} isMobile={isMobile}>
      <BoxLogo id={Identifier.PUBLIC_SHARE_PROTOTYPE_IMAGE} url={logoURL} size={logoSize} isMobile={isMobile} />

      {children}
    </ContentContainer>

    {!hideVFBranding && (
      <WaterMark color="#8da2b5" width="100%" display="inline-block" textAlign={centerAlign ? 'center' : undefined}>
        Conversation{' '}
        <span role="img" aria-label="powered">
          ⚡
        </span>{' '}
        by{' '}
        <Link color={colorScheme} href="https://voiceflow.com">
          Voiceflow
        </Link>
      </WaterMark>
    )}
  </Container>
);

export default FullPageTemplate;
