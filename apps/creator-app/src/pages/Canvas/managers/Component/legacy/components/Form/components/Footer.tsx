import * as Realtime from '@voiceflow/realtime-sdk';
import { Button } from '@voiceflow/ui';
import React from 'react';

import * as Documentation from '@/config/documentation';
import { Designer } from '@/ducks';
import * as DiagramV2 from '@/ducks/diagramV2';
import * as Router from '@/ducks/router';
import { useDispatch, useFeature, useSelector } from '@/hooks';
import EditorV2, { EditorV2Types } from '@/pages/Canvas/components/EditorV2';
import { NodeEditorV2Props } from '@/pages/Canvas/managers/types';

interface FooterProps {
  editor: NodeEditorV2Props<Realtime.NodeData.Component, Realtime.NodeData.ComponentBuiltInPorts>;
  tutorial?: EditorV2Types.DefaultFooter.Props['tutorial'];
}

const Footer: React.FC<FooterProps> = ({ editor, tutorial = Documentation.COMPONENT_STEP }) => {
  const { isEnabled: isCMSComponentsEnabled } = useFeature(Realtime.FeatureFlag.CMS_COMPONENTS);
  const flow = useSelector(Designer.Flow.selectors.byDiagramID, {
    diagramID: editor.data.diagramID,
  });
  const diagram = useSelector(DiagramV2.diagramByIDSelector, { id: editor.data.diagramID });
  const diagramID = isCMSComponentsEnabled ? flow?.diagramID : diagram?.id;

  const goToDiagram = useDispatch(Router.goToDiagramHistoryPush);

  return (
    <EditorV2.DefaultFooter tutorial={tutorial}>
      {diagramID && (
        <Button variant={Button.Variant.PRIMARY} onClick={() => goToDiagram(diagramID, undefined, editor.nodeID)} squareRadius>
          Edit
        </Button>
      )}
    </EditorV2.DefaultFooter>
  );
};

export default Footer;
