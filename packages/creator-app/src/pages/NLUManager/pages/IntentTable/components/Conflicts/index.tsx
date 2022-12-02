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

const Conflicts: React.FC = () => {
  const theme = useTheme();
  const { clarity, activeItemID: intentID, closeEditorTab, intents: nluIntents, fetchClarity } = useNLUManager();
  const [trackingEvents] = useTrackingEvents();
  const [isScrolling, setIsScrolling] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const intentsByID = React.useMemo(() => {
    return nluIntents.reduce((acc, intent) => {
      acc[intent.id] = intent;
      return acc;
    }, {} as Record<string, NLUIntent>);
  }, [nluIntents]);

  const { conflicts, onMoveUtterance, onEditUtterance, onDeleteUtterance, modifiedUtterances, shouldApplyChanges, calculateConflicts } =
    useIntentConflictsForm(intentID, clarity);

  const { submit } = useConflictsSubmit(intentID);

  const handleSubmit = async () => {
    setIsLoading(true);

    try {
      const updatedModel = await submit(modifiedUtterances);

      const conflictsData = await fetchClarity(updatedModel);

      const conflicts = calculateConflicts(conflictsData);

      toast.success('Changes applied successfully');

      if (!conflicts || Object.keys(conflicts).length === 0) {
        closeEditorTab();
      }
    } catch (e) {
      toast.error('Could not apply changes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setIsScrolling(e.currentTarget.scrollTop > 0);
  };

  const headerStyle = { height: `${theme.components.page.header.height + 3}px` };

  React.useEffect(() => {
    if (!intentID) return;
    trackingEvents.trackConflictsViewed({ intentID });
  }, [intentID]);

  React.useEffect(() => {
    calculateConflicts();
  }, []);

  return (
    <Drawer open width={1000} offset={450} zIndex={19} direction={Drawer.Direction.LEFT} style={{ width: drawerWidth }}>
      <SidebarEditor.Container>
        <SidebarEditor.Header
          style={
            isScrolling
              ? {
                  ...headerStyle,
                  boxShadow: isScrolling && '0 0 8px 0 rgb(19 33 68 / 8%)',
                  zIndex: 2,
                  borderBottom: isScrolling && '1px solid rgb(234 239 243)',
                }
              : headerStyle
          }
        >
          <SidebarEditor.HeaderTitle fontWeight={800} fontSize={18}>
            Conflicting Intents
          </SidebarEditor.HeaderTitle>

          <SectionV2.ActionsContainer gap={18}>
            <HelpTooltip />

            <IconButton size={16} icon="close" variant={IconButton.Variant.BASIC} onClick={closeEditorTab} offsetSize={0} />
          </SectionV2.ActionsContainer>
        </SidebarEditor.Header>

        <SectionV2.Content
          topOffset={3}
          bottomOffset={3}
          padding="0px"
          onScroll={handleScroll}
          style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'scroll' }}
        >
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
              <Button variant={ButtonVariant.PRIMARY} onClick={handleSubmit} disabled={!shouldApplyChanges}>
                <Box display="inline-block" position="relative" top={2}>
                  <SvgIcon icon="arrowSpin" spin={isLoading} size={16} inline mr={16} />
                </Box>
                Apply Changes
              </Button>
            </S.ContentContainer>
          </S.Footer>
        </SectionV2.Content>
      </SidebarEditor.Container>
    </Drawer>
  );
};

export default Conflicts;
