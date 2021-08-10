import { FlexAround } from '@voiceflow/ui';
import React from 'react';

import { ControlledEditorProvider, FontStyles, HyperlinkButton, TextColor } from '@/components/SlateEditable';
import { withRequiredEngine } from '@/contexts';
import { useTrackingEvents } from '@/hooks';
import { Markup } from '@/models';
import { Content } from '@/pages/Canvas/components/Editor';
import Section from '@/pages/Canvas/components/MarkupSection';
import type { Engine } from '@/pages/Canvas/engine';
import { NodeEditorPropsType } from '@/pages/Canvas/managers/types';

import { IconButton, IconButtonSeparator, TextAligns, TextStyles } from './components';

export const MarkupTextEditor: React.FC<NodeEditorPropsType<Markup.NodeData.Text> & { engine: Engine }> = ({ nodeID, engine }) => {
  const [key, editor] = engine.markup.useTextEditor(nodeID);
  const [trackingEvents] = useTrackingEvents();

  React.useEffect(() => {
    trackingEvents.trackMarkupText();
  }, []);

  return !editor ? null : (
    <ControlledEditorProvider editor={editor} contextKey={key}>
      <Content>
        <Section>
          <FontStyles />
        </Section>

        <Section>
          <FlexAround>
            <TextAligns />

            <IconButtonSeparator />

            <TextStyles />

            <IconButtonSeparator />

            <HyperlinkButton>{(props) => <IconButton {...props} />}</HyperlinkButton>
          </FlexAround>
        </Section>

        <Section>
          <TextColor />
        </Section>
      </Content>
    </ControlledEditorProvider>
  );
};

export default withRequiredEngine(MarkupTextEditor) as React.FC<NodeEditorPropsType<Markup.NodeData.Text>>;
