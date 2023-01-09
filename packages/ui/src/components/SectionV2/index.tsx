import React from 'react';

import {
  ActionCollapseSection,
  ActionListSection,
  ActionsContainer,
  AddButton,
  AddButtonDropdown,
  CollapseArrowIcon,
  CollapseSection,
  Container,
  Content,
  Description,
  Divider,
  ErrorMessage,
  Header,
  InfoIconTooltip,
  InfoMessage,
  LinkArrowIcon,
  LinkSection,
  ListItem,
  ListItemContent,
  RemoveButton,
  SimpleContentSection,
  SimpleSection,
  Status,
  Sticky,
  Title,
} from './components';
import * as T from './types';

export * as SectionV2Types from './types';

const SectionV2 = React.forwardRef<HTMLDivElement, T.Props>(({ header, children, ...containerProps }, ref) => (
  <Container ref={ref} {...containerProps}>
    {header}
    {children}
  </Container>
));

export default Object.assign(SectionV2, {
  Title,
  Sticky,
  Status,
  Header,
  Divider,
  Content,
  ListItem,
  AddButton,
  Container,
  Description,
  LinkSection,
  InfoMessage,
  ErrorMessage,
  RemoveButton,
  LinkArrowIcon,
  SimpleSection,
  InfoIconTooltip,
  ListItemContent,
  CollapseSection,
  ActionsContainer,
  CollapseArrowIcon,
  ActionListSection,
  AddButtonDropdown,
  SimpleContentSection,
  ActionCollapseSection,
});
