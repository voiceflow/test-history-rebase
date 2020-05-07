import React from 'react';

import { FeatureFlag } from '@/config/features';
import { useFeature } from '@/hooks';
import Canvas from '@/pages/Canvas';
import CanvasControls from '@/pages/Canvas/components/CanvasControls';
import { CanvasReadOnly } from '@/pages/Canvas/components/CanvasControls/components';
import PrototypeSidebar from '@/pages/Canvas/components/PrototypeSidebar';
import { ManagerProvider } from '@/pages/Canvas/contexts';
import CanvasHeader from '@/pages/Canvas/header';
import { getManager } from '@/pages/Canvas/managers';
import { SettingsModalProvider } from '@/pages/Settings/contexts';
import DesignMenu from '@/pages/Skill/menus/DesignMenu';
import MarkupMenu from '@/pages/Skill/menus/MarkupMenu';

import { EditPermissionProvider, MarkupModeContext, ShortcutModalProvider } from '../contexts';
import DiagramSync from './DiagramSync';
import FlowControls from './FlowControls';

export type DiagramProps = {
  diagramID: string;
  isPrototyping: boolean;
};

const Diagram: React.FC<DiagramProps> = ({ diagramID, isPrototyping }) => {
  const markupTool = React.useContext(MarkupModeContext);
  const markupFeature = useFeature(FeatureFlag.MARKUP);

  return (
    <>
      {!isPrototyping && <DiagramSync diagramID={diagramID} />}
      <ManagerProvider value={getManager as any}>
        <EditPermissionProvider isPrototyping={isPrototyping}>
          <ShortcutModalProvider>
            <SettingsModalProvider>
              <CanvasHeader />

              {markupFeature.isEnabled && markupTool?.isOpen ? <MarkupMenu /> : <DesignMenu />}

              <CanvasControls />

              <CanvasReadOnly />

              <FlowControls />

              <Canvas isPrototyping={isPrototyping} />
              <PrototypeSidebar />
            </SettingsModalProvider>
          </ShortcutModalProvider>
        </EditPermissionProvider>
      </ManagerProvider>
    </>
  );
};

export default Diagram;
