import { storiesOf } from '@storybook/react';
import React from 'react';

import { createTestableStory } from '@/../.storybook';
import Drawer from '@/components/Drawer';
import OverflowMenu from '@/componentsV2/OverflowMenu';

import Editor, { Controls as EditorControls, FormControl, Section as EditorSection } from '.';

const LOREM_IPSUM =
  'Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptatem quas, eligendi pariatur dolores fuga expedita, placeat ullam earum similique porro repellendus provident iusto esse saepe totam perferendis, deserunt accusamus ducimus.';

storiesOf('Creator/Editor', module).add(
  'variants',
  createTestableStory(() => (
    <Drawer direction="left" width={450} open>
      <Editor
        path={[{ label: 'Blocks', path: 'block' }, { label: 'Welcome Block', path: '123413' }]}
        controls={
          <EditorControls menu={<OverflowMenu options={[]} />} options={[{ label: 'Action', icon: 'alexa' }]}>
            {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
            <a href="">What?</a>
          </EditorControls>
        }
      >
        <EditorSection label="Collapsible Section" collapse>
          <FormControl label="Some Control">
            <input />
          </FormControl>
          <FormControl>{LOREM_IPSUM}</FormControl>
        </EditorSection>
        <EditorSection label="Second Section">
          <FormControl label="Some Control">
            <input />
          </FormControl>
        </EditorSection>
        <EditorSection label="Third Section">
          <FormControl>{LOREM_IPSUM}</FormControl>
        </EditorSection>
        <EditorSection label="Fourth Section">
          <FormControl label="Some Control">
            <input />
          </FormControl>
          <FormControl>{LOREM_IPSUM}</FormControl>
        </EditorSection>
      </Editor>
    </Drawer>
  ))
);
