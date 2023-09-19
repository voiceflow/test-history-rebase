import { Box, Button, ButtonVariant, SectionV2, SidebarEditor, SvgIcon, System, useSetup } from '@voiceflow/ui';
import { toast } from '@voiceflow/ui-next';
import * as Normal from 'normal-store';
import React from 'react';

import Drawer from '@/components/Drawer';
import { useDragPreview, useTheme, useTrackingEvents } from '@/hooks';
import { EDITOR_LEFT_SIDEBAR_WIDTH, MENU_RIGHT_SIDEBAR_WIDTH } from '@/pages/NLUManager/constants';
import { useNLUManager } from '@/pages/NLUManager/context';
import { useConflictsSubmit, useIntentConflictsForm } from '@/pages/NLUManager/hooks';
import { ConflictUtterance } from '@/pages/NLUManager/types';

import HelpTooltip from './components/HelpTooltip';
import IntentItem from './components/IntentItem';
import UtterancePreview from './components/UtterancePreview';
import { DragAndDropTypes } from './constants';
import * as S from './styles';

const drawerWidth = `calc(100vw - ${EDITOR_LEFT_SIDEBAR_WIDTH + MENU_RIGHT_SIDEBAR_WIDTH - 1}px)`;

const Conflicts: React.FC = () => {
  const theme = useTheme();
  const { clarity, activeItemID: intentID, closeEditorTab, intents: nluIntents, fetchClarity } = useNLUManager();
  const [trackingEvents] = useTrackingEvents();
  const [isScrolling, setIsScrolling] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);

  const normalIntents = React.useMemo(() => Normal.normalize(nluIntents), [nluIntents]);

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

      if (!conflicts?.allKeys.length) {
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

  useSetup(() => calculateConflicts(), []);

  useDragPreview(
    DragAndDropTypes.UTTERANCE,
    (props: ConflictUtterance & { _width: number }) => <UtterancePreview text={props.sentence} utteranceWidth={props._width} />,
    { horizontalEnabled: true }
  );

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
            Conflicts
          </SidebarEditor.HeaderTitle>

          <SectionV2.ActionsContainer gap={18}>
            <HelpTooltip />

            <System.IconButton.Base icon="close" onClick={closeEditorTab} />
          </SectionV2.ActionsContainer>
        </SidebarEditor.Header>

        <SectionV2.Content
          style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column', overflow: 'scroll' }}
          padding="0px"
          topOffset={3}
          bottomOffset={3}
          onScroll={handleScroll}
        >
          {conflicts.map((conflict) => (
            <S.IntentsGrid key={conflict.id}>
              {Normal.hasOne(normalIntents, conflict.intentID) && (
                <IntentItem
                  intent={Normal.getOne(normalIntents, conflict.intentID)!}
                  conflictID={conflict.id}
                  utterances={Normal.getOne(conflict.utterances, conflict.intentID)}
                  onMoveUtterance={onMoveUtterance}
                  onEditUtterance={onEditUtterance}
                  onDeleteUtterance={onDeleteUtterance}
                />
              )}

              <div style={{ borderLeft: '1px solid #eaeff4' }}>
                {conflict.utterances.allKeys.map((utteranceIntentID) =>
                  conflict.intentID === utteranceIntentID
                    ? null
                    : Normal.hasOne(normalIntents, utteranceIntentID) && (
                        <IntentItem
                          key={utteranceIntentID}
                          intent={Normal.getOne(normalIntents, utteranceIntentID)!}
                          conflictID={conflict.id}
                          utterances={Normal.getOne(conflict.utterances, utteranceIntentID)}
                          onMoveUtterance={onMoveUtterance}
                          onEditUtterance={onEditUtterance}
                          onDeleteUtterance={onDeleteUtterance}
                        />
                      )
                )}
              </div>
            </S.IntentsGrid>
          ))}

          <S.Footer>
            <S.ContentContainer>
              <Button variant={ButtonVariant.PRIMARY} onClick={handleSubmit} disabled={!shouldApplyChanges}>
                <Box.Flex flexDirection="row">
                  <Box display="inline-block" position="relative" top={2}>
                    <SvgIcon icon="arrowSpin" spin={isLoading} size={16} inline mr={16} />
                  </Box>
                  Apply Changes
                </Box.Flex>
              </Button>
            </S.ContentContainer>
          </S.Footer>
        </SectionV2.Content>
      </SidebarEditor.Container>
    </Drawer>
  );
};

export default Conflicts;
