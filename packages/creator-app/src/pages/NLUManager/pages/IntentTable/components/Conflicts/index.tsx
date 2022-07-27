import { Box, Button, ButtonVariant, FlexEnd, IconButton, SectionV2, SidebarEditor, SvgIcon } from '@voiceflow/ui';
import React from 'react';

import Drawer from '@/components/Drawer';
import { EDITOR_LEFT_SIDEBAR_WIDTH, MENU_RIGHT_SIDEBAR_WIDTH } from '@/pages/NLUManager/constants';
import { useNLUManager } from '@/pages/NLUManager/context';

import HelpTooltip from './components/HelpTooltip';
import IntentItem from './components/IntentItem';
import { intentNameMap } from './constants';
import useIntentConflicts from './hooks/useIntentConflicts';
import * as S from './styles';

const drawerWidth = `calc(100vw - ${EDITOR_LEFT_SIDEBAR_WIDTH + MENU_RIGHT_SIDEBAR_WIDTH - 1}px)`;

const Conflicts: React.FC = () => {
  const {
    conflicts,
    isSubmitting,
    onSubmit: handleSubmit,
    onMoveUtterance,
    onEditUtterance,
    onDeleteUtterance,
    shouldApplyChanges,
  } = useIntentConflicts();
  const nluManager = useNLUManager();

  return (
    <Drawer open width={1000} offset={450} zIndex={19} direction={Drawer.Direction.LEFT} style={{ width: drawerWidth }}>
      <SidebarEditor.Container>
        <SidebarEditor.Header style={{ height: '65px' }}>
          <SidebarEditor.HeaderTitle fontWeight={600} fontSize={15}>
            Conflicting Intents
          </SidebarEditor.HeaderTitle>

          <SectionV2.ActionsContainer gap={8}>
            <HelpTooltip />

            <IconButton size={16} icon="close" variant={IconButton.Variant.BASIC} onClick={nluManager.closeEditorTab} offsetSize={0} />
          </SectionV2.ActionsContainer>
        </SidebarEditor.Header>

        <SidebarEditor.Content $fillHeight autoHeight autoHeightMax="100%" hideTracksWhenNotNeeded>
          <SectionV2.Content topOffset={3} bottomOffset={3} padding="0px" style={{ position: 'relative' }}>
            {conflicts.map((conflict, index) => (
              <S.IntentsGrid key={index}>
                <IntentItem
                  intentName={intentNameMap[conflict.intentID]}
                  intentID={conflict.intentID}
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
                        intentName={intentNameMap[conflictIntentID]}
                        intentID={conflictIntentID}
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

            <FlexEnd style={{ marginTop: '24px' }}>
              <S.ContentContainer>
                <Button variant={ButtonVariant.PRIMARY} squareRadius onClick={handleSubmit} disabled={!shouldApplyChanges}>
                  <Box display="inline-block" position="relative" top={2}>
                    <SvgIcon icon="publishSpin" spin={isSubmitting} size={16} inline mr={16} />
                  </Box>
                  Apply Changes
                </Button>
              </S.ContentContainer>
            </FlexEnd>
          </SectionV2.Content>
        </SidebarEditor.Content>
      </SidebarEditor.Container>
    </Drawer>
  );
};

export default Conflicts;
