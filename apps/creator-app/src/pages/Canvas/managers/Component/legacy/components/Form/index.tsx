import * as Realtime from '@voiceflow/realtime-sdk';
import { SectionV2 } from '@voiceflow/ui';
import React from 'react';

import ComponentSelect from '@/components/ComponentSelect';
import * as DiagramV2 from '@/ducks/diagramV2';
import { useSelector } from '@/hooks';
import EditorV2 from '@/pages/Canvas/components/EditorV2';
import { NodeEditorV2Props } from '@/pages/Canvas/managers/types';

import { Footer } from './components';

interface FormProps extends React.PropsWithChildren {
  editor: NodeEditorV2Props<Realtime.NodeData.Component, Realtime.NodeData.ComponentBuiltInPorts>;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const Form: React.FC<FormProps> = ({ editor, header, footer, children }) => {
  const diagram = useSelector(DiagramV2.diagramByIDSelector, { id: editor.data.diagramID });

  return (
    <EditorV2 header={header ?? <EditorV2.DefaultHeader />} footer={footer ?? <Footer editor={editor} />}>
      <SectionV2.SimpleSection isAccent>
        <ComponentSelect diagramID={diagram?.id ?? null} onChange={(diagramID) => editor.onChange({ diagramID, inputs: [], outputs: [] })} />
      </SectionV2.SimpleSection>

      {children}
    </EditorV2>
  );
};

export default Object.assign(Form, { Footer });
