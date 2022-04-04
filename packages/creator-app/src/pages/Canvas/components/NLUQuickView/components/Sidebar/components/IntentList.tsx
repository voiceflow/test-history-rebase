import * as Realtime from '@voiceflow/realtime-sdk';
import { IconButton, IconButtonVariant, TippyTooltip, toast } from '@voiceflow/ui';
import React from 'react';

import { SectionToggleVariant } from '@/components/Section';
import { InteractionModelTabType } from '@/constants';
import * as Intent from '@/ducks/intent';
import * as IntentV2 from '@/ducks/intentV2';
import { useAsyncEffect, useDispatch, useSelector } from '@/hooks';
import { NLUQuickViewContext } from '@/pages/Canvas/components/NLUQuickView/context';

import { useFilteredList, useOrderedIntents } from '../../../hooks';
import { useCreatingItem, useSectionHooks } from '../hooks';
import { SectionSection } from '.';
import ListItem from './ListItem';
import { SectionProps } from './types';

const IntentList: React.FC<SectionProps> = ({
  setIsActiveItemRename,
  isActiveItemRename,
  setSearchLength,
  search,
  selectedID,
  setActiveTab,
  setSelectedItemID,
}) => {
  const { onRenameIntent, deleteItem, setIsCreatingItem, nameChangeTransform, activeTab, setSelectedID, forceNewInlineIntent } =
    React.useContext(NLUQuickViewContext);
  const createIntent = useDispatch(Intent.createIntent);

  const allIntents = useSelector(IntentV2.allIntentsSelector);
  const allCustomIntentsMap = useSelector(IntentV2.customIntentMapSelector);

  const isActiveTab = React.useMemo(() => activeTab === InteractionModelTabType.INTENTS, [activeTab]);

  const { sortedIntents } = useOrderedIntents();

  const filteredList = useFilteredList(search, sortedIntents) as Realtime.Intent[];

  useSectionHooks({
    setSearchLength,
    listLength: allIntents.length,
    isActiveTab,
    map: allCustomIntentsMap,
  });

  const onDeleteIntent = (id: string) => {
    deleteItem(id);
  };

  const handleConfirmNewIntentName = React.useCallback(
    (newName: string, newIntentID: string) => {
      if (allIntents.some(({ name, id }) => name === newName && newIntentID !== id)) {
        throw new Error('Intent name already in use, use a different name');
      } else {
        onRenameIntent(newName, newIntentID!);
        resetCreating();
      }
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
        const newIntentID = await createIntent();
        setNewIntentID(newIntentID);
        setSelectedID(newIntentID);
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
            type={InteractionModelTabType.INTENTS}
            active={isActive}
            onClick={() => setSelectedItemID(intent.id)}
            key={intent.id}
            name={intent.name}
            onDelete={onDeleteIntent}
            onRename={onRenameIntent}
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
