import { BaseModels } from '@voiceflow/base-types';
import { Box, useToggle } from '@voiceflow/ui';
import React from 'react';

import NoteEditor from '@/components/NoteEditor';
import { SectionToggleVariant, SectionVariant, UncontrolledSection } from '@/components/Section';
import * as IntentV2 from '@/ducks/intentV2';
import { useSelector } from '@/hooks';
import { DividerBorder } from '@/pages/Canvas/components/IntentModalsV2/components/components';

interface DescriptionSectionProps {
  intentID: string;
  onCreateNote: (noteID: string) => void;
  withBottomBorder?: boolean;
}

const DescriptionSection: React.FC<DescriptionSectionProps> = ({ intentID, withBottomBorder = true, onCreateNote }) => {
  const [isCollapsed, toggleIsCollapsed] = useToggle(true);
  const intent = useSelector(IntentV2.getIntentByIDSelector)({ id: intentID });
  if (!intent) return null;

  const { noteID } = intent;

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
            height={300}
            onUpsert={(note) => !noteID && onCreateNote(note.id)}
            placeholder="Add intent description, or @mention"
          />
        </Box>
      </UncontrolledSection>

      {isCollapsed && withBottomBorder && <DividerBorder />}
    </>
  );
};

export default DescriptionSection;
