import { action } from '@storybook/addon-actions';
import { text } from '@storybook/addon-knobs';
import React from 'react';

import Drawer from '@/components/Drawer';
import SvgIcon from '@/components/SvgIcon';
import OverflowMenu from '@/componentsV2/OverflowMenu';
import Section, { SectionToggleVariant } from '@/componentsV2/Section';
import { SidebarProvider } from '@/pages/Canvas/components/EditSidebar/contexts';
import { EngineProvider } from '@/pages/Canvas/contexts';
import { withRedux } from '@/utils/testing';

import Editor, { Content, Controls as EditorControls, FormControl } from '.';

const LOREM_IPSUM =
  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem quas, eligendi pariatur dolores fuga expedita, placeat ullam earum similique porro repellendus provident iusto esse saepe totam perferendis, deserunt accusamus ducimus.';

export default {
  title: 'Creator/Editor',
  component: Editor,
};

const withDecorators = withRedux({
  creator: {
    focus: {
      target: 'abc',
    },
    diagram: {
      data: {
        abc: {},
      },
    },
  },
});

export const normal = withDecorators(() => (
  <SidebarProvider>
    <EngineProvider value={{ saveHistory: action('saveHistory') }}>
      <Drawer direction="left" width={450} open>
        <Editor
          path={[{ label: 'Blocks', path: 'block' }, { label: 'Welcome Block', path: '123413' }]}
          name={text('name', 'name')}
          onRename={action('onRename')}
          renameRevision={text('renameRevision')}
          headerActions={[
            {
              label: 'Remove',
              onClick: action('onRemove'),
            },
            {
              label: 'Copy',
              onClick: action('onCopy'),
            },
          ]}
        >
          {/* individual manager level */}
          <Content
            footer={
              <EditorControls menu={<OverflowMenu options={[]} />} options={[{ label: 'Action', icon: 'alexa' }]}>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
                <a href="">What?</a>
              </EditorControls>
            }
          >
            <Section
              headerToggle={true}
              prefix="star"
              collapseVariant={SectionToggleVariant.ARROW}
              tooltip="Rich Tooltip"
              header="Collapsible Section, Fully Clickable"
            >
              <FormControl>{LOREM_IPSUM}</FormControl>
            </Section>
            <Section variant="tertiary" tooltip="Whats gewchi" collapseVariant={SectionToggleVariant.TOGGLE} count={3} header="Toggle in Child">
              {({ toggle }) => {
                return (
                  <FormControl>
                    <button onClick={toggle}>Click me to toggle</button>
                    {LOREM_IPSUM}
                  </FormControl>
                );
              }}
            </Section>
            <Section opened prefix={<span style={{ border: '1px solid black' }}>Prefix Elmnt</span>} header="No Collapse Section">
              <FormControl>{LOREM_IPSUM}</FormControl>
            </Section>
            <Section
              prefix={<SvgIcon variant="standard" icon="volume" />}
              collapseVariant={SectionToggleVariant.ARROW}
              status="Status"
              header="Fourth Section"
            >
              <FormControl>{LOREM_IPSUM}</FormControl>
            </Section>

            <Section>
              <FormControl>NO HEADER SECTION {LOREM_IPSUM}</FormControl>
            </Section>
          </Content>
        </Editor>
      </Drawer>
    </EngineProvider>
  </SidebarProvider>
));
