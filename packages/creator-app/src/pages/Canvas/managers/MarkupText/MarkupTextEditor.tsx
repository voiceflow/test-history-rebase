import * as Realtime from '@voiceflow/realtime-sdk';
import { FlexAround } from '@voiceflow/ui';
import React from 'react';

import { ControlledEditorProvider, FontStyles, HyperlinkButton, TextColor } from '@/components/SlateEditable';
import { withRequiredEngine } from '@/contexts';
import { useTrackingEvents } from '@/hooks';
import { Content } from '@/pages/Canvas/components/Editor';
import MarkupSection from '@/pages/Canvas/components/MarkupSection';
import type { Engine } from '@/pages/Canvas/engine';
import { NodeEditorPropsType } from '@/pages/Canvas/managers/types';

import { BackgroundColor, IconButton, IconButtonSeparator, TextAligns, TextStyles } from './components';

export const MarkupTextEditor: React.FC<NodeEditorPropsType<Realtime.Markup.NodeData.Text> & { engine: Engine }> = ({ nodeID, data, engine }) => {
  const [key, editor] = engine.markup.useTextEditor(nodeID);
  const [trackingEvents] = useTrackingEvents();

  React.useEffect(() => {
    trackingEvents.trackMarkupText();
  }, []);

  return !editor ? null : (
    <ControlledEditorProvider editor={editor} contextKey={key}>
      <Content>
        <MarkupSection>
          <FontStyles />
        </MarkupSection>

        <MarkupSection>
          <FlexAround>
            <TextAligns />

            <IconButtonSeparator />

            <TextStyles />

            <IconButtonSeparator />

            <HyperlinkButton>{(props) => <IconButton {...props} />}</HyperlinkButton>
          </FlexAround>
        </MarkupSection>

        <MarkupSection>
          <TextColor />
        </MarkupSection>

        <BackgroundColor nodeID={nodeID} data={data} />
      </Content>
    </ControlledEditorProvider>
  );
};

export default withRequiredEngine(MarkupTextEditor) as React.FC<NodeEditorPropsType<Realtime.Markup.NodeData.Text>>;
