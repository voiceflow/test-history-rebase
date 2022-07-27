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
  Divider,
  Header,
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
  Content,
  ListItem,
  ListItemContent,
  AddButton,
  Container,
  LinkSection,
  RemoveButton,
  LinkArrowIcon,
  SimpleSection,
  CollapseSection,
  ActionsContainer,
  CollapseArrowIcon,
  ActionListSection,
  AddButtonDropdown,
  SimpleContentSection,
  ActionCollapseSection,
});
