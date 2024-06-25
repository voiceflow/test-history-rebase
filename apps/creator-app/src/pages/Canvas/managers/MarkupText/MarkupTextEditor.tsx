import type * as Realtime from '@voiceflow/realtime-sdk';
import { Divider, SectionV2, stopPropagation, System } from '@voiceflow/ui';
import React from 'react';

import { ControlledEditorProvider, FontStyles, HyperlinkButton, TextColor } from '@/components/SlateEditable';
import { withRequiredEngine } from '@/contexts/EventualEngineContext';
import { useTrackingEvents } from '@/hooks';
import { Content } from '@/pages/Canvas/components/Editor';
import type Engine from '@/pages/Canvas/engine';
import type { NodeEditorPropsType } from '@/pages/Canvas/managers/types';

import { BackgroundColor, TextAligns, TextStyles } from './components';

export const MarkupTextEditor: React.FC<NodeEditorPropsType<Realtime.Markup.NodeData.Text> & { engine: Engine }> = ({
  nodeID,
  data,
  engine,
}) => {
  const [key, editor] = engine.markup.useTextEditor(nodeID);
  const [trackingEvents] = useTrackingEvents();

  React.useEffect(() => {
    trackingEvents.trackMarkupText();
  }, []);

  return !editor ? null : (
    <ControlledEditorProvider editor={editor} contextKey={key}>
      <Content>
        <SectionV2.SimpleSection>
          <FontStyles />
        </SectionV2.SimpleSection>

        <SectionV2.Divider inset />

        <SectionV2.SimpleSection>
          <TextAligns />

          <Divider offset={10} height={16} isVertical />

          <TextStyles />

          <Divider offset={10} height={16} isVertical />

          <HyperlinkButton>
            {(props) => <System.IconButton.Base {...props} onClick={stopPropagation()} />}
          </HyperlinkButton>
        </SectionV2.SimpleSection>

        <SectionV2.Divider inset />

        <SectionV2.SimpleSection>
          <TextColor />
        </SectionV2.SimpleSection>

        <SectionV2.Divider inset />

        <BackgroundColor nodeID={nodeID} data={data} />
      </Content>
    </ControlledEditorProvider>
  );
};

export default withRequiredEngine(MarkupTextEditor) as React.FC<NodeEditorPropsType<Realtime.Markup.NodeData.Text>>;
