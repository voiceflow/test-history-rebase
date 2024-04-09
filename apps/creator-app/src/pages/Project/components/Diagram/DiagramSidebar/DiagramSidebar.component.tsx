import { Box, DraggablePanel, ResizableSection, Section, Text } from '@voiceflow/ui-next';
import { IResizableSectionAPI } from '@voiceflow/ui-next/build/cjs/components/Section/ResizableSection/types';
import React, { useRef } from 'react';

import { Permission } from '@/constants/permissions';
import { UI } from '@/ducks';
import { useFlowCreateModal, useWorkflowCreateModal } from '@/hooks/modal.hook';
import { usePermission } from '@/hooks/permission';
import { useLocalStorageState } from '@/hooks/storage.hook';
import { useSelector } from '@/hooks/store.hook';

import StepMenu from '../../StepMenu';
import { bottomHeaderSectionStyle, containerStyle, topHeaderSectionStyle } from './DiagramSidebar.css';
import { DiagramSidebarToolbar } from './DiagramSidebarToolbar.component';

export const DiagramSidebar: React.FC = () => {
  const flowCreateModal = useFlowCreateModal();
  const workflowCreateModal = useWorkflowCreateModal();

  const resizableSectionRef = useRef<IResizableSectionAPI>(null);

  const [footerCollapsed, setFooterCollapsed] = useLocalStorageState('diagram-sidebar-footer-collapsed', false);

  const canvasOnly = useSelector(UI.isCanvasOnlyShowingSelector);
  const [canEditCanvas] = usePermission(Permission.CANVAS_EDIT);

  return (
    <div className={containerStyle({ canvasOnly })}>
      <DraggablePanel>
        <ResizableSection
          id="diagram-sidebar"
          ref={resizableSectionRef}
          onCollapseChange={setFooterCollapsed}
          topContent={
            <Box px={24}>
              <Text>Top Content</Text>
            </Box>
          }
          bottomContent={
            <Box px={24}>
              <Text>Bottom Content</Text>
            </Box>
          }
          topHeader={
            <Section.Header.Container py={11} theme="dark" title="Workflows" className={topHeaderSectionStyle}>
              <Section.Header.Button
                variant="dark"
                onClick={() => workflowCreateModal.openVoid({ folderID: null })}
                disabled={!canEditCanvas}
                iconName="Plus"
              />
            </Section.Header.Container>
          }
          bottomHeader={
            <Section.Header.Container
              py={11}
              theme="dark"
              title="Components"
              className={bottomHeaderSectionStyle}
              onHeaderClick={footerCollapsed ? () => resizableSectionRef.current?.expand() : undefined}
            >
              <Section.Header.Button
                variant="dark"
                onClick={footerCollapsed ? undefined : () => flowCreateModal.openVoid({ folderID: null })}
                iconName={footerCollapsed ? 'ArrowUpS' : 'Plus'}
                disabled={!footerCollapsed && !canEditCanvas}
              />
            </Section.Header.Container>
          }
        />

        <StepMenu />
        <DiagramSidebarToolbar />
      </DraggablePanel>
    </div>
  );
};
