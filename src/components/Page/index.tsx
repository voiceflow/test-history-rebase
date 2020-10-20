import React from 'react';

import BackButtonHeader from '@/components/BackButtonHeader';

import { Container, Content } from './components';

export { Container };

export type PageProps = {
  header?: React.ReactNode;
  onNavigateBack: () => void;
  subHeader?: React.ReactNode;
  canScroll?: boolean;
  scrollHorizontal?: boolean;
  navigateBackText?: string;
  headerChildren?: React.ReactNode;
};

const Page: React.FC<PageProps> = ({
  header,
  navigateBackText,
  subHeader,
  scrollHorizontal,
  canScroll = true,
  onNavigateBack,
  children,
  headerChildren,
}) => {
  return (
    <Container>
      <BackButtonHeader header={header} subHeader={subHeader} onNavigateBack={onNavigateBack} navigateBackText={navigateBackText}>
        {headerChildren}
      </BackButtonHeader>

      <Content scrollHorizontal={scrollHorizontal} canScroll={canScroll}>
        {children}
      </Content>
    </Container>
  );
};

export default Page;
