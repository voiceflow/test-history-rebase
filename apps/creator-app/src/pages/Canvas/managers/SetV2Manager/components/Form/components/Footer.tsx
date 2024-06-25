import type * as Realtime from '@voiceflow/realtime-sdk';
import { Button } from '@voiceflow/ui';
import React from 'react';

import * as Documentation from '@/config/documentation';
import type { MapManagedFactoryAPI } from '@/hooks';
import type { EditorV2Types } from '@/pages/Canvas/components/EditorV2';
import EditorV2 from '@/pages/Canvas/components/EditorV2';

interface FooterProps {
  tutorial?: EditorV2Types.DefaultFooter.Props['tutorial'];
  mapManager: MapManagedFactoryAPI<Realtime.NodeData.SetExpressionV2>;
}

const Footer: React.FC<FooterProps> = ({ tutorial = Documentation.SET_STEP, mapManager }) => {
  return (
    <EditorV2.DefaultFooter tutorial={tutorial}>
      {!mapManager.isMaxReached && (
        <Button variant={Button.Variant.PRIMARY} onClick={() => mapManager.onAdd()} squareRadius>
          Add Set
        </Button>
      )}
    </EditorV2.DefaultFooter>
  );
};

export default Footer;
