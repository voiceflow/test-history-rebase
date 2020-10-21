import React from 'react';

import { Flex } from '@/components/Box';
import { FlexCenter, FlexEnd } from '@/components/Flex';
import { BackButton } from '@/components/Header/components';
import SvgIcon from '@/components/SvgIcon';
import ArrowLeftIcon from '@/svgs/arrow-left.svg';

import { HeaderContainer, NavigateBackTextContainer, SubHeader } from './components';

export type BackButtonHeaderProps = {
  header?: React.ReactNode;
  subHeader?: React.ReactNode;
  onNavigateBack: () => void;
  navigateBackText?: string;
};

const BackButtonComp: React.FC<any> = BackButton;

const BackButtonHeader: React.FC<BackButtonHeaderProps> = ({ header, subHeader, onNavigateBack, navigateBackText, children }) => (
  <HeaderContainer style={{ minWidth: '100%' }}>
    <Flex style={{ padding: 'none', height: '70px', backgroundColor: '#fff' }}>
      <FlexCenter style={{ minWidth: '100%', height: '100%', padding: 'none' }}>
        {onNavigateBack && (
          <BackButtonComp hasBackText={!!navigateBackText} onClick={onNavigateBack}>
            <SvgIcon icon={ArrowLeftIcon} size={14} className="icon-back" />
            {navigateBackText && <NavigateBackTextContainer>{navigateBackText}</NavigateBackTextContainer>}
          </BackButtonComp>
        )}
        {header}
        <FlexEnd
          style={{
            padding: 'none',
            alignItems: 'center',
            marginRight: '32px',
            width: '100%',
            minHeight: '100%',
            height: '100%',
          }}
        >
          {children}
        </FlexEnd>
      </FlexCenter>
    </Flex>
    {subHeader && <SubHeader>{subHeader}</SubHeader>}
  </HeaderContainer>
);

export default BackButtonHeader;
