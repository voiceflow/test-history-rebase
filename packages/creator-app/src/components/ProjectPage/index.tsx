import React from 'react';

import { Body, Container, Content, ContentProps } from './components';

export type { HeaderIconButtonProps } from './components';
export {
  Header,
  HeaderBackButton,
  HeaderDivider,
  HeaderHotkeyToAction,
  HeaderIconButton,
  HeaderLogoButton,
  HeaderNavLinkSidebarTitle,
  HeaderTitle,
} from './components';

export interface ProjectPageProps extends Partial<ContentProps> {
  renderHeader?: () => React.ReactNode;
  renderSidebar?: () => React.ReactNode;
}

const ProjectPage: React.FC<ProjectPageProps> = ({ renderHeader, renderSidebar, children, scrollable = true }) => {
  return (
    <Container>
      {renderHeader?.()}

      <Body>
        {renderSidebar?.()}

        <Content scrollable={scrollable}>{children}</Content>
      </Body>
    </Container>
  );
};
export default ProjectPage;
