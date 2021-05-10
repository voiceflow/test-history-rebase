import React from 'react';

import { FlexAround } from '@/components/Flex';
import { withRequiredEngine } from '@/contexts';
import { Markup } from '@/models';
import { Content } from '@/pages/Canvas/components/Editor';
import Section from '@/pages/Canvas/components/MarkupSection';
import type { Engine } from '@/pages/Canvas/engine';
import { NodeEditorPropsType } from '@/pages/Canvas/managers/types';
import { MarkupContext } from '@/pages/Skill/contexts';

import { FontStyles, Hyperlink, IconButtonSeparator, TextAligns, TextColor, TextStyles } from './components';

export const MarkupTextEditor: React.FC<NodeEditorPropsType<Markup.NodeData.Text> & { engine: Engine }> = ({ nodeID, engine }) => {
  const markup = React.useContext(MarkupContext)!;

  const editor = engine.markup.useTextEditor(nodeID);

  React.useEffect(() => {
    markup.startMarkupSession();

    return () => {
      markup.finishMarkupSession();
    };
  }, []);

  return !editor ? null : (
    <Content>
      <Section>
        <FontStyles editor={editor} />
      </Section>

      <Section>
        <FlexAround>
          <TextAligns editor={editor} />

          <IconButtonSeparator />

          <TextStyles editor={editor} />

          <IconButtonSeparator />

          <Hyperlink editor={editor} />
        </FlexAround>
      </Section>

      <Section>
        <TextColor editor={editor} />
      </Section>
    </Content>
  );
};

export default withRequiredEngine(MarkupTextEditor) as React.FC<NodeEditorPropsType<Markup.NodeData.Text>>;
