import { Utils } from '@voiceflow/common';
import { System, TippyTooltip, toast } from '@voiceflow/ui';
import React from 'react';

import { SectionToggleVariant } from '@/components/Section';
import { InteractionModelTabType } from '@/constants';
import { NLUContext } from '@/contexts/NLUContext';
import * as IntentV2 from '@/ducks/intentV2';
import * as Tracking from '@/ducks/tracking';
import { useAsyncEffect, useDispatch, useSelector } from '@/hooks';
import { useOrderedIntents } from '@/hooks/intent.hook';
import { getErrorMessage } from '@/utils/error';
import { isIntentBuiltIn } from '@/utils/intent.util';

import { NLUQuickViewContext } from '../../../context';
import { useFilteredList } from '../../../hooks';
import { useCreatingItem, useListHooks } from '../hooks';
import ListItem from './ListItem';
import { SectionSection } from './styles';
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

  const createIntent = useDispatch(IntentV2.createIntent);

  const allIntents = useSelector(IntentV2.allIntentsSelector);
  const allCustomIntentsMap = useSelector(IntentV2.customIntentMapSelector);
  const isActiveTab = React.useMemo(() => activeTab === InteractionModelTabType.INTENTS, [activeTab]);

  const sortedIntents = useOrderedIntents();
  const filteredList = useFilteredList(search, sortedIntents);
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
        const newIntentID = await createIntent(Tracking.CanvasCreationType.IMM, { name: generateItemName(InteractionModelTabType.INTENTS) });
        setSelectedID(newIntentID);
        setNewIntentID(newIntentID);
      } catch (e) {
        toast.error(getErrorMessage(e));
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
          <TippyTooltip content="Create intent" position="top">
            <System.IconButtonsGroup.Base mr={-12}>
              <System.IconButton.Base icon="plus" onClick={triggerCreate} />
            </System.IconButtonsGroup.Base>
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
            isBuiltIn={isIntentBuiltIn(intent.id)}
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
