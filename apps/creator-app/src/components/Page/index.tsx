import React from 'react';

import { Header, Section } from './components';
import * as S from './styles';
import * as T from './types';

const Page: React.FC<T.Props> = ({ renderHeader, renderSidebar, sidebarPadding, children, scrollable = true, white, className }) => (
  <S.Container className={className}>
    {renderHeader?.()}

    <S.Body>
      {renderSidebar?.()}

      <S.ContentContainer scrollable={scrollable} white={white} sidebarPadding={sidebarPadding}>
        {children}
      </S.ContentContainer>
    </S.Body>
  </S.Container>
);

export default Object.assign(Page, {
  S,

  Header,
  Content: S.Content,
  Section,
});
