import { BaseModels } from '@voiceflow/base-types';
import { Box, useToggle } from '@voiceflow/ui';
import React from 'react';

import Divider from '@/components/Divider';
import NoteEditor from '@/components/NoteEditor';
import { SectionToggleVariant, SectionVariant, UncontrolledSection } from '@/components/Section';

interface DescriptionSectionProps {
  noteID?: string;
  intentID: string;
  onCreateNote: (noteID: string) => void;
}

const DescriptionSection: React.FC<DescriptionSectionProps> = ({ noteID, intentID, onCreateNote }) => {
  const [isCollapsed, toggleIsCollapsed] = useToggle(true);

  const headerStyling = { paddingBottom: isCollapsed ? undefined : '16px' };

  return (
    <>
      <UncontrolledSection
        headerToggle
        collapseVariant={SectionToggleVariant.ARROW}
        header="Description"
        variant={SectionVariant.PRIMARY}
        forceDividers
        isCollapsed={isCollapsed}
        toggle={toggleIsCollapsed}
        customHeaderStyling={headerStyling}
      >
        <Box paddingBottom={14} minHeight={100}>
          <NoteEditor<BaseModels.IntentNote>
            id={noteID}
            type={BaseModels.NoteType.INTENT}
            meta={{ intentID }}
            height={100}
            onUpsert={(note) => !noteID && onCreateNote(note.id)}
            placeholder="Add intent description, or @mention"
          />
        </Box>
      </UncontrolledSection>

      {isCollapsed && <Divider style={{ margin: 0, background: '#eaeff4' }} />}
    </>
  );
};

export default DescriptionSection;
