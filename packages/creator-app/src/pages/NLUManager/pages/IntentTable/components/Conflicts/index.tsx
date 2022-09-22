import { Box, Button, ButtonVariant, IconButton, SectionV2, SidebarEditor, SvgIcon, toast } from '@voiceflow/ui';
import React from 'react';

import Drawer from '@/components/Drawer';
import { useTheme, useTrackingEvents } from '@/hooks';
import { EDITOR_LEFT_SIDEBAR_WIDTH, MENU_RIGHT_SIDEBAR_WIDTH } from '@/pages/NLUManager/constants';
import { useNLUManager } from '@/pages/NLUManager/context';
import { useConflictsSubmit, useIntentConflictsForm } from '@/pages/NLUManager/hooks';
import { NLUIntent } from '@/pages/NLUManager/types';

import HelpTooltip from './components/HelpTooltip';
import IntentItem from './components/IntentItem';
import * as S from './styles';

const drawerWidth = `calc(100vw - ${EDITOR_LEFT_SIDEBAR_WIDTH + MENU_RIGHT_SIDEBAR_WIDTH - 1}px)`;

interface ConflictsProps {
  onChangesApplied: () => void;
}

const Conflicts: React.FC<ConflictsProps> = ({ onChangesApplied }) => {
  const theme = useTheme();
  const { clarity, activeItemID: intentID, closeEditorTab, intents: nluIntents } = useNLUManager();
  const [trackingEvents] = useTrackingEvents();

  const intentsByID = React.useMemo(() => {
    return nluIntents.reduce((acc, intent) => {
      acc[intent.id] = intent;
      return acc;
    }, {} as Record<string, NLUIntent>);
  }, [nluIntents]);

  const { conflicts, onMoveUtterance, onEditUtterance, onDeleteUtterance, modifiedUtterances } = useIntentConflictsForm(intentID, clarity);

  const { submit, isLoading } = useConflictsSubmit(intentID);

  const handleSubmit = async () => {
    try {
      await submit(modifiedUtterances);

      onChangesApplied();

      closeEditorTab();
      toast.success('Changes applied successfully');
    } catch (e) {
      toast.error('Could not apply changes');
    }
  };

  React.useEffect(() => {
    if (!intentID) return;
    trackingEvents.trackConflictsViewed({ intentID });
  }, [intentID]);

  return (
    <Drawer open width={1000} offset={450} zIndex={19} direction={Drawer.Direction.LEFT} style={{ width: drawerWidth }}>
      <SidebarEditor.Container>
        <SidebarEditor.Header style={{ height: `${theme.components.projectPage.header.height}px` }}>
          <SidebarEditor.HeaderTitle fontWeight={800} fontSize={15}>
            Conflicting Intents
          </SidebarEditor.HeaderTitle>

          <SectionV2.ActionsContainer gap={8}>
            <HelpTooltip />

            <IconButton size={16} icon="close" variant={IconButton.Variant.BASIC} onClick={closeEditorTab} offsetSize={0} />
          </SectionV2.ActionsContainer>
        </SidebarEditor.Header>

        <SidebarEditor.Content $fillHeight autoHeight autoHeightMax="100%" hideTracksWhenNotNeeded>
          <SectionV2.Content topOffset={3} bottomOffset={3} padding="0px" style={{ position: 'relative' }}>
            {conflicts.map((conflict, index) => (
              <S.IntentsGrid key={index}>
                <IntentItem
                  intent={intentsByID?.[conflict.intentID]}
                  conflictID={conflict.id}
                  utterances={conflict.utterances[conflict.intentID]}
                  onMoveUtterance={onMoveUtterance}
                  onDeleteUtterance={onDeleteUtterance}
                  onEditUtterance={onEditUtterance}
                />

                <div style={{ borderLeft: '1px solid #eaeff4' }}>
                  {Object.keys(conflict.utterances)
                    .filter((intentID) => conflict.intentID !== intentID)
                    .map((conflictIntentID, index) => (
                      <IntentItem
                        intent={intentsByID?.[conflictIntentID]}
                        conflictID={conflict.id}
                        utterances={conflict.utterances[conflictIntentID]}
                        key={`${conflictIntentID}-${index}`}
                        onMoveUtterance={onMoveUtterance}
                        onDeleteUtterance={onDeleteUtterance}
                        onEditUtterance={onEditUtterance}
                      />
                    ))}
                </div>
              </S.IntentsGrid>
            ))}

            <S.Footer>
              <S.ContentContainer>
                <Button variant={ButtonVariant.PRIMARY} squareRadius onClick={handleSubmit}>
                  <Box display="inline-block" position="relative" top={2}>
                    <SvgIcon icon="arrowSpin" spin={isLoading} size={16} inline mr={16} />
                  </Box>
                  Apply Changes
                </Button>
              </S.ContentContainer>
            </S.Footer>
          </SectionV2.Content>
        </SidebarEditor.Content>
      </SidebarEditor.Container>
    </Drawer>
  );
};

export default Conflicts;
