import { Utils } from '@voiceflow/common';
import * as Realtime from '@voiceflow/realtime-sdk';
import { IconButton, IconButtonVariant, TippyTooltip, toast } from '@voiceflow/ui';
import React from 'react';

import { SectionToggleVariant } from '@/components/Section';
import { InteractionModelTabType } from '@/constants';
import { NLUContext } from '@/contexts';
import * as Intent from '@/ducks/intent';
import * as IntentV2 from '@/ducks/intentV2';
import { useAsyncEffect, useDispatch, useOrderedIntents, useSelector } from '@/hooks';
import { NLUQuickViewContext } from '@/pages/Canvas/components/NLUQuickView/context';
import { isBuiltInIntent } from '@/utils/intent';

import { useFilteredList } from '../../../hooks';
import { useCreatingItem, useListHooks } from '../hooks';
import { SectionSection } from '.';
import ListItem from './ListItem';
import { SectionProps } from './types';

const IntentList: React.FC<SectionProps> = ({
  search,
  selectedID,
  setActiveTab,
  setSearchLength,
  setSelectedItemID,
  isActiveItemRename,
  setIsActiveItemRename,
}) => {
  const { setIsCreatingItem, nameChangeTransform, activeTab, setSelectedID, forceNewInlineIntent } = React.useContext(NLUQuickViewContext);
  const { renameItem, generateItemName } = React.useContext(NLUContext);

  const createIntent = useDispatch(Intent.createIntent);

  const allIntents = useSelector(IntentV2.allIntentsSelector);
  const allCustomIntentsMap = useSelector(IntentV2.customIntentMapSelector);
  const isActiveTab = React.useMemo(() => activeTab === InteractionModelTabType.INTENTS, [activeTab]);

  const sortedIntents = useOrderedIntents();
  const filteredList = useFilteredList(search, sortedIntents) as Realtime.Intent[];
  const firstItem = React.useMemo(() => filteredList.find((item) => item.id), [filteredList]);

  useListHooks({
    map: allCustomIntentsMap,
    listLength: allIntents.length,
    isActiveTab,
    setSearchLength,
  });

  const handleConfirmNewIntentName = React.useCallback(
    (newName: string, newIntentID: string) => {
      if (allIntents.some(({ name, id }) => name === newName && newIntentID !== id)) {
        renameItem(`${newName}_${Utils.id.cuid()}`, newIntentID!, InteractionModelTabType.INTENTS);
        toast.error('Intent name already in use, use a different name');
      } else {
        renameItem(newName, newIntentID!, InteractionModelTabType.INTENTS);
      }
      resetCreating();
    },
    [allIntents]
  );

  const {
    createNewItemComponent,
    newItemID: newIntentID,
    setNewItemID: setNewIntentID,
    isCreating,
    setIsCreating,
    resetCreating,
  } = useCreatingItem({
    itemMap: allCustomIntentsMap,
    nameValidation: (name: string) => nameChangeTransform(name, InteractionModelTabType.INTENTS),
    onBlur: handleConfirmNewIntentName,
    forceCreate: forceNewInlineIntent,
  });

  useAsyncEffect(async () => {
    if (isCreating) {
      try {
        const newIntentID = await createIntent({ name: generateItemName(InteractionModelTabType.INTENTS) });

        setSelectedID(newIntentID);
        setNewIntentID(newIntentID);
      } catch (e) {
        toast.error(e);
      } finally {
        setIsCreatingItem(false);
      }
    }
  }, [isCreating]);

  const triggerCreate = () => {
    setIsCreating(true);
    setIsCreatingItem(true);
  };

  return (
    <SectionSection
      onClick={() => setActiveTab(InteractionModelTabType.INTENTS)}
      isExpanded={isActiveTab && !!filteredList.length}
      header="Intents"
      forceDividers
      headerToggle
      collapseVariant={isActiveTab ? null : SectionToggleVariant.ARROW}
      isCollapsed={!isActiveTab}
      suffix={
        isActiveTab && (
          <TippyTooltip title="Create intent" position="top">
            <IconButton style={{ marginRight: -12 }} onClick={triggerCreate} variant={IconButtonVariant.BASIC} icon="plus" />
          </TippyTooltip>
        )
      }
    >
      {createNewItemComponent()}

      {filteredList.map((intent) => {
        if (newIntentID === intent.id) return null;

        const isActive = !isCreating && selectedID === intent.id;

        return (
          <ListItem
            id={intent.id}
            isBuiltIn={isBuiltInIntent(intent.id)}
            type={InteractionModelTabType.INTENTS}
            active={isActive}
            onClick={() => setSelectedItemID(intent.id)}
            key={intent.id}
            name={intent.name}
            onRename={(name, id) => renameItem(name, id, InteractionModelTabType.INTENTS)}
            onDelete={() => isActive && firstItem && setSelectedItemID(firstItem.id)}
            nameValidation={(name) => nameChangeTransform(name, InteractionModelTabType.INTENTS)}
            setIsActiveItemRename={setIsActiveItemRename}
            isActiveItemRename={isActiveItemRename}
          />
        );
      })}
    </SectionSection>
  );
};

export default IntentList;
