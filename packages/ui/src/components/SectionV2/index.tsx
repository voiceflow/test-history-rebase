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
  ContainerProps,
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

export interface SectionV2Props extends ContainerProps {
  header?: React.ReactNode;
  children?: React.ReactNode;
}

const SectionV2 = React.forwardRef<HTMLDivElement, SectionV2Props>(({ header, children, ...containerProps }, ref) => (
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
  Description,
  Content,
  ListItem,
  AddButton,
  Container,
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
