import { Box, FlexApart, FlexEnd, SVG, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import { BackButton } from '@/components/Header/components';
import { Identifier } from '@/styles/constants';

import { HeaderContainer, NavigateBackTextContainer, SubHeader } from './components';

export interface BackButtonHeaderProps {
  render?: boolean;
  header?: React.ReactNode;
  subHeader?: React.ReactNode;
  onNavigateBack: () => void;
  navigateBackText?: string;
}

const BackButtonComp: React.FC<any> = BackButton;

const BackButtonHeader: React.FC<BackButtonHeaderProps> = ({ render, header, subHeader, onNavigateBack, navigateBackText, children }) => {
  return render ? (
    <>
      <HeaderContainer style={{ minWidth: '100%' }}>
        <Box.Flex style={{ padding: 'none', height: '70px', backgroundColor: '#fff' }}>
          <FlexApart style={{ minWidth: '100%', height: '100%', padding: 'none' }}>
            {onNavigateBack && (
              <BackButtonComp hasBackText={!!navigateBackText} onClick={onNavigateBack} id={Identifier.HEADER_BACK}>
                <SvgIcon icon={SVG.arrowLeft} size={14} className="icon-back" />
                {navigateBackText && <NavigateBackTextContainer>{navigateBackText}</NavigateBackTextContainer>}
              </BackButtonComp>
            )}
            <div style={{ fontSize: '18px' }}>{header}</div>
            <FlexEnd
              style={{
                padding: 'none',
                alignItems: 'center',
                marginRight: '32px',
                minHeight: '100%',
                height: '100%',
              }}
            >
              {children}
            </FlexEnd>
          </FlexApart>
        </Box.Flex>
        {subHeader && <SubHeader>{subHeader}</SubHeader>}
      </HeaderContainer>
    </>
  ) : null;
};

export default BackButtonHeader;
