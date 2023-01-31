/* eslint-disable no-console */
import { SectionV2, System, Toggle, useToggle } from '@voiceflow/ui';
import React from 'react';

import { withBox } from './hocs';
import { createExample, createSection } from './utils';

const wrapContainer = withBox({ width: 300, backgroundColor: '#fff' });

const simple = createExample(
  'simple',
  wrapContainer(() => <SectionV2.SimpleSection>content</SectionV2.SimpleSection>)
);

const simpleWithTitleAndControl = createExample(
  'simple with title, control and accent',
  wrapContainer(() => {
    const [bold, onToggle] = useToggle();

    return (
      <SectionV2.SimpleSection isAccent onClick={onToggle}>
        <SectionV2.Title bold={bold}>{bold ? 'Disable' : 'Enable'} bold Title</SectionV2.Title>

        <Toggle checked={bold} />
      </SectionV2.SimpleSection>
    );
  })
);

const linkSection = createExample(
  'link section',
  wrapContainer(() => (
    <SectionV2.LinkSection onClick={console.log}>
      <SectionV2.Title>Link</SectionV2.Title>
    </SectionV2.LinkSection>
  ))
);

const collapseHeaderContentToggle = createExample(
  'collapse header content toggle',
  wrapContainer(() => (
    <SectionV2.CollapseSection
      header={({ onToggle, collapsed }) => (
        <SectionV2.Header gap={12}>
          <SectionV2.Title bold={!collapsed}>Title</SectionV2.Title>

          <System.IconButtonsGroup.Base>
            <System.IconButton.Base icon={collapsed ? 'plus' : 'close'} onClick={onToggle} />
          </System.IconButtonsGroup.Base>
        </SectionV2.Header>
      )}
    >
      <SectionV2.Content>Collapsed content</SectionV2.Content>
    </SectionV2.CollapseSection>
  ))
);

const collapseContainerToggle = createExample(
  'collapse container toggle',
  wrapContainer(() => (
    <SectionV2.CollapseSection
      containerToggle
      defaultCollapsed={true}
      header={({ collapsed }) => (
        <SectionV2.Header>
          <SectionV2.Title bold={!collapsed}>{collapsed ? 'Open' : 'Close'}</SectionV2.Title>
        </SectionV2.Header>
      )}
    >
      <SectionV2.Content>Collapsed content</SectionV2.Content>
    </SectionV2.CollapseSection>
  ))
);

const addCollapseSection = createExample(
  'add collapse',
  wrapContainer(() => {
    const [collapsed, setCollapsed] = React.useState(false);

    return (
      <SectionV2.ActionCollapseSection
        title={<SectionV2.Title bold={!collapsed}>Title</SectionV2.Title>}
        action={
          collapsed ? <SectionV2.AddButton onClick={() => setCollapsed(false)} /> : <SectionV2.RemoveButton onClick={() => setCollapsed(true)} />
        }
        collapsed={collapsed}
      >
        <SectionV2.ListItem actionCentred onClick={console.log}>
          Simple item
        </SectionV2.ListItem>

        <SectionV2.ListItem icon="setV2" actionCentred onClick={console.log}>
          Item with icon
        </SectionV2.ListItem>

        <SectionV2.ListItem icon="setV2" isActive actionCentred onClick={console.log}>
          Active icon
        </SectionV2.ListItem>

        <SectionV2.ListItem icon="setV2" action={<SectionV2.RemoveButton />} actionCentred onClick={console.log}>
          Item with icon and action
        </SectionV2.ListItem>

        <SectionV2.ListItem icon="warning" iconProps={{ color: '#BF395B' }} action={<SectionV2.RemoveButton />} actionCentred onClick={console.log}>
          Warning
        </SectionV2.ListItem>
      </SectionV2.ActionCollapseSection>
    );
  })
);

const sectionsWithDividerBetween = createExample(
  'multiple sections with divider between',
  wrapContainer(() => (
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
  linkSection,
  collapseHeaderContentToggle,
  collapseContainerToggle,
  addCollapseSection,
  sectionsWithDividerBetween,
]);
