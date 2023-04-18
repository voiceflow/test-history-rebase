import { BaseModels } from '@voiceflow/base-types';
import { Box, Divider, useToggle } from '@voiceflow/ui';
import React from 'react';

import NoteEditor from '@/components/NoteEditor';
import { SectionToggleVariant, SectionVariant, UncontrolledSection } from '@/components/Section';
import * as IntentV2 from '@/ducks/intentV2';
import * as Tracking from '@/ducks/tracking';
import { useSelector } from '@/hooks';

interface DescriptionSectionProps {
  intentID: string;
  creationType: Tracking.IntentEditType;
  onCreateNote: (noteID: string) => void;
  withBottomBorder?: boolean;
}

const DescriptionSection: React.FC<DescriptionSectionProps> = ({ intentID, creationType, withBottomBorder = true, onCreateNote }) => {
  const [isCollapsed, toggleIsCollapsed] = useToggle(true);
  const intent = useSelector(IntentV2.getIntentByIDSelector)({ id: intentID });
  const inputRef = React.useRef<HTMLInputElement>(null);
  if (!intent) return null;

  const { noteID } = intent;

  const headerStyling = { paddingBottom: isCollapsed ? undefined : '16px' };

  const handleToggle = () => {
    if (isCollapsed) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }

    toggleIsCollapsed();
  };

  return (
    <>
      <UncontrolledSection
        headerToggle
        collapseVariant={SectionToggleVariant.ARROW}
        header="Description"
        variant={SectionVariant.PRIMARY}
        forceDividers
        isCollapsed={isCollapsed}
        toggle={handleToggle}
        customHeaderStyling={headerStyling}
      >
        <Box paddingBottom={14} minHeight={100}>
          <NoteEditor<BaseModels.IntentNote>
            id={noteID}
            creationType={creationType}
            type={BaseModels.NoteType.INTENT}
            meta={{ intentID }}
            height={300}
            onUpsert={(note) => !noteID && onCreateNote(note.id)}
            placeholder="Add intent description, or @mention"
            inputRef={inputRef}
          />
        </Box>
      </UncontrolledSection>

      {isCollapsed && withBottomBorder && <Divider offset={0} isSecondaryColor />}
    </>
  );
};

export default DescriptionSection;
