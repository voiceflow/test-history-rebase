/* eslint-disable no-console */
import { Box, IconButton, IconButtonVariant, SectionV2, Toggle, useToggle } from '@voiceflow/ui';
import React from 'react';

import { createExample, createSection } from './utils';

const withBackground = (Component: React.FC) => () =>
  (
    <Box width={300} backgroundColor="#fff">
      <Component />
    </Box>
  );

const simple = createExample(
  'simple',
  withBackground(() => <SectionV2.SimpleSection>content</SectionV2.SimpleSection>)
);

const simpleWithTitleAndControl = createExample(
  'simple with title and control',
  withBackground(() => {
    const [bold, onToggle] = useToggle();

    return (
      <SectionV2.SimpleSection onClick={onToggle}>
        <SectionV2.Title bold={bold}>{bold ? 'Disable' : 'Enable'} bold Title</SectionV2.Title>

        <Toggle checked={bold} />
      </SectionV2.SimpleSection>
    );
  })
);

const collapseHeaderContentToggle = createExample(
  'collapse header content toggle',
  withBackground(() => (
    <SectionV2.CollapseSection
      renderHeader={({ onToggle, collapsed }) => (
        <SectionV2.Header>
          <SectionV2.Title>Title</SectionV2.Title>

          <SectionV2.ActionsContainer>
            <IconButton icon={collapsed ? 'add' : 'close'} variant={IconButtonVariant.BASIC} onClick={onToggle} />
          </SectionV2.ActionsContainer>
        </SectionV2.Header>
      )}
    >
      <SectionV2.Content>Collapsed content</SectionV2.Content>
    </SectionV2.CollapseSection>
  ))
);

const collapseContainerToggle = createExample(
  'collapse container toggle',
  withBackground(() => (
    <SectionV2.CollapseSection
      containerToggle
      initialCollapsed={true}
      renderHeader={({ collapsed }) => (
        <SectionV2.Header>
          <SectionV2.Title>{collapsed ? 'Open' : 'Close'}</SectionV2.Title>
        </SectionV2.Header>
      )}
    >
      <SectionV2.Content>Collapsed content</SectionV2.Content>
    </SectionV2.CollapseSection>
  ))
);

const addCollapseSection = createExample(
  'add collapse',
  withBackground(() => {
    const [collapsed, setCollapsed] = React.useState(false);

    return (
      <SectionV2.AddCollapseSection title="Title" collapsed={collapsed} onAdd={() => setCollapsed(false)} onRemove={() => setCollapsed(true)}>
        <SectionV2.ListItem>Simple item</SectionV2.ListItem>

        <SectionV2.ListItem icon="entities">Item with icon</SectionV2.ListItem>

        <SectionV2.ListItem icon="entities" isActive>
          Active icon
        </SectionV2.ListItem>

        <SectionV2.ListItem icon="entities" actionIcon="minus" onActionClick={console.log}>
          Item with icon and action
        </SectionV2.ListItem>

        <SectionV2.ListItem icon="entities" actionIcon="minus" onActionClick={console.log} iconWarning="Some message">
          Item with icon, action and warning
        </SectionV2.ListItem>
      </SectionV2.AddCollapseSection>
    );
  })
);

const sectionsWithDividerBetween = createExample(
  'multiple sections with divider between',
  withBackground(() => (
    <>
      <simpleWithTitleAndControl.component />

      <SectionV2.Divider inset />

      <collapseContainerToggle.component />

      <SectionV2.Divider inset />

      <addCollapseSection.component />
    </>
  ))
);

export default createSection('SectionV2', 'src/components/SectionV2/index.tsx', [
  simple,
  simpleWithTitleAndControl,
  collapseHeaderContentToggle,
  collapseContainerToggle,
  addCollapseSection,
  sectionsWithDividerBetween,
]);
