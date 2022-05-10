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
  RemoveButton,
  SimpleSection,
  Status,
  Sticky,
  Title,
} from './components';

interface SectionV2Props extends ContainerProps {
  header?: React.ReactNode;
  children?: React.ReactNode;
}

const SectionV2: React.ForwardRefRenderFunction<HTMLDivElement, SectionV2Props> = ({ header, children, ...containerProps }, ref) => (
  <Container ref={ref} {...containerProps}>
    {header}
    {children}
  </Container>
);

export default Object.assign(React.forwardRef(SectionV2), {
  Title,
  Sticky,
  Status,
  Header,
  Divider,
  Content,
  ListItem,
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
  ActionCollapseSection,
});
