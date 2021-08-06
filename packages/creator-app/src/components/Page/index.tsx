import React from 'react';

import BackButtonHeader from '@/components/BackButtonHeader';
import * as UI from '@/ducks/ui';
import { connect } from '@/hocs';
import { useHotKeys } from '@/hooks';
import { Hotkey } from '@/keymap';
import { ConnectedProps } from '@/types';

import { Container, Content } from './components';

export { Container };

export interface PageProps {
  header?: React.ReactNode;
  onNavigateBack: () => void;
  subHeader?: React.ReactNode;
  canScroll?: boolean;
  scrollHorizontal?: boolean;
  navigateBackText?: string;
  headerChildren?: React.ReactNode;
}

const Page: React.FC<PageProps & ConnectedPageProps> = ({
  header,
  navigateBackText,
  subHeader,
  scrollHorizontal,
  canScroll = true,
  onNavigateBack,
  children,
  headerChildren,
  canvasOnly,
  toggleCanvasOnly,
}) => {
  useHotKeys(Hotkey.SHOW_HIDE_UI, toggleCanvasOnly, { preventDefault: true }, [toggleCanvasOnly]);

  return (
    <Container>
      <BackButtonHeader
        render={!canvasOnly}
        header={header}
        subHeader={subHeader}
        onNavigateBack={onNavigateBack}
        navigateBackText={navigateBackText}
      >
        {headerChildren}
      </BackButtonHeader>

      <Content scrollHorizontal={scrollHorizontal} canScroll={canScroll}>
        {children}
      </Content>
    </Container>
  );
};

const mapStateToProps = {
  canvasOnly: UI.isCanvasOnlyShowingSelector,
};

const mapDispatchToProps = {
  toggleCanvasOnly: UI.toggleCanvasOnly,
};

type ConnectedPageProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(Page) as React.FC<PageProps>;
