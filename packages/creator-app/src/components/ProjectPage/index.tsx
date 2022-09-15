import React from 'react';

import { BlockType } from '@/constants';
import { MarkupContext } from '@/pages/Project/contexts';
import { useDisableModes } from '@/pages/Project/hooks';

import { Body, ClickableLayer, Container, Content, ContentProps, Wrapper } from './components';

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
  const markup = React.useContext(MarkupContext);
  const onDisableModes = useDisableModes();
  const isCreatingMarkupText = markup?.creatingType === BlockType.MARKUP_TEXT;

  return (
    <Container isCreatingMarkupText={isCreatingMarkupText}>
      <Wrapper>
        {renderHeader?.()}
        {isCreatingMarkupText && <ClickableLayer onClick={onDisableModes} />}
      </Wrapper>

      <Body>
        <Wrapper>
          {renderSidebar?.()}
          {isCreatingMarkupText && <ClickableLayer onClick={onDisableModes} />}
        </Wrapper>

        <Content scrollable={scrollable}>{children}</Content>
      </Body>
    </Container>
  );
};
export default ProjectPage;
