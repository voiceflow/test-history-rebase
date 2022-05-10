import { Box, BoxFlex, IconButton, IconButtonVariant } from '@voiceflow/ui';
import React from 'react';

import { InteractionModelTabType } from '@/constants';
import { NLUContext } from '@/contexts';
import { useLinkedState } from '@/hooks';
import EditEntityForm from '@/pages/Canvas/components/EntityModalsV2/components/EntityForm/EditEntityForm';
import EditIntentForm from '@/pages/Canvas/components/IntentModalsV2/components/IntentForm/EditIntentForm';
import { TitleInput } from '@/pages/Canvas/components/NLUQuickView/components';
import HeaderOptions from '@/pages/Canvas/components/NLUQuickView/components/HeaderOptions';
import { NLUManagerContext } from '@/pages/NLUManager/context';
import { isBuiltInIntent } from '@/utils/intent';

import { SliderContainer, SliderHeader } from './components';

const FormSlider: React.FC = () => {
  const { canRenameItem, renameItem, nameChangeTransform } = React.useContext(NLUContext);
  const titleRef = React.useRef<HTMLInputElement>(null);

  const { selectedItemId, selectedItem, setSelectedItemId, activeTab } = React.useContext(NLUManagerContext);
  const [headerTitle, setHeaderTitle] = useLinkedState(selectedItem?.name || '');

  const showSlider = !!selectedItemId && (activeTab === InteractionModelTabType.SLOTS || activeTab === InteractionModelTabType.INTENTS);
  return (
    <SliderContainer opened={showSlider && !!selectedItem}>
      <SliderHeader>
        {selectedItem && selectedItemId && (
          <TitleInput
            fontSize={18}
            ref={titleRef}
            minWidth={200}
            value={headerTitle}
            onBlur={() => renameItem(headerTitle, selectedItemId, activeTab)}
            onChangeText={(text) => setHeaderTitle(nameChangeTransform(text, activeTab))}
            placeholder="Name"
            onEnterPress={() => renameItem(headerTitle, selectedItemId, activeTab)}
            disabled={!canRenameItem(selectedItemId!, activeTab)}
          />
        )}
        <BoxFlex justifyContent="center" minWidth={60}>
          {!!selectedItemId && (
            <Box mr={16} display="inline-block">
              <HeaderOptions
                isBuiltIn={!!selectedItemId && isBuiltInIntent(selectedItemId)}
                itemType={activeTab}
                selectedID={selectedItemId}
                onRename={() => {
                  titleRef.current?.focus();
                }}
              />
            </Box>
          )}
          <IconButton
            style={{ display: 'inline-block' }}
            size={16}
            icon="close"
            variant={IconButtonVariant.BASIC}
            onClick={() => setSelectedItemId('')}
          />
        </BoxFlex>
      </SliderHeader>
      <Box position="relative" overflow="auto">
        {!!selectedItemId && (
          <>
            {activeTab === InteractionModelTabType.INTENTS && <EditIntentForm intentID={selectedItemId} rightSlider />}
            {activeTab === InteractionModelTabType.SLOTS && (
              <EditEntityForm
                colorPopperModifiers={[{ name: 'offset', options: { offset: [-240, -25] } }]}
                withNameSection={false}
                slotID={selectedItemId}
              />
            )}
          </>
        )}
      </Box>
    </SliderContainer>
  );
};

export default FormSlider;
