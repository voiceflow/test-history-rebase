import * as Realtime from '@voiceflow/realtime-sdk';
import { Alert } from '@voiceflow/ui';
import React from 'react';

import AceEditor from '@/components/AceEditor';
import Section, { SectionToggleVariant, SectionVariant } from '@/components/Section';
import { NodeEditor } from '@/pages/Canvas/managers/types';

const DeprecatedEditor: NodeEditor<Realtime.NodeData.Deprecated> = ({ data: { deprecatedType, ...originalData } }) => (
  <Section>
    <Alert variant={Alert.Variant.WARNING} mb={16}>
      This "{deprecatedType}" block is now deprecated and is no longer available. This assistant will still work, but we recommend you to update this
      block as soon as possible.
    </Alert>

    <Section header="JSON Data" variant={SectionVariant.SECONDARY} isNested headerToggle collapseVariant={SectionToggleVariant.ARROW}>
      <AceEditor
        name="deprecatedStepJSON"
        mode="json"
        readOnly
        fontSize={14}
        showPrintMargin={false}
        showGutter
        height="400px"
        highlightActiveLine
        value={JSON.stringify(originalData, null, 2)}
        setOptions={{
          tabSize: 2,
        }}
      />
    </Section>
    <Section isNested />
  </Section>
);

export default DeprecatedEditor;
