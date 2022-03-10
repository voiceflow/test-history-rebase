import { Utils } from '@voiceflow/common';
import { IconButton, IconButtonVariant, TippyTooltip, toast } from '@voiceflow/ui';
import _sortBy from 'lodash/sortBy';
import React from 'react';

import { SectionToggleVariant } from '@/components/Section';
import { InteractionModelTabType } from '@/constants';
import * as Intent from '@/ducks/intent';
import * as IntentV2 from '@/ducks/intentV2';
import * as ProjectV2 from '@/ducks/projectV2';
import * as SlotV2 from '@/ducks/slotV2';
import { useDispatch, useSelector } from '@/hooks';
import { applyPlatformIntentNameFormatting, isCustomizableBuiltInIntent, validateIntentName } from '@/utils/intent';

import { SectionSection } from '.';
import ListItem from './ListItem';
import { SectionProps } from './types';

const IntentSection: React.FC<SectionProps> = ({ setSearchLength, search, selectedID, activeTab, setActiveTab, setSelectedItemID }) => {
  const allCustomIntents = useSelector(IntentV2.allCustomIntentsSelector);
  const allCustomIntentsMap = useSelector(IntentV2.customIntentMapSelector);
  const allSlots = useSelector(SlotV2.allSlotsSelector);
  const platform = useSelector(ProjectV2.active.platformSelector);

  const deleteIntent = useDispatch(Intent.deleteIntent);
  const patchIntent = useDispatch(Intent.patchIntent);
  const createIntent = useDispatch(Intent.createIntent);

  const [isCreating, setIsCreating] = React.useState(false);
  const [newIntentID, setNewIntentID] = React.useState('');
  const isActiveTab = React.useMemo(() => activeTab === InteractionModelTabType.INTENTS, [activeTab]);

  const existingCustomIntents = React.useMemo(() => {
    return allCustomIntents.filter(({ id }) => id !== newIntentID);
  }, [newIntentID, allCustomIntents]);

  const sortedCustomIntents = React.useMemo(
    () => _sortBy(existingCustomIntents, isCustomizableBuiltInIntent, (intent) => intent.name.toLowerCase()),
    [existingCustomIntents]
  );

  React.useEffect(() => {
    if (isActiveTab) {
      setSearchLength(allCustomIntents.length);
    }
  }, [allCustomIntents, isActiveTab]);

  const filteredCustomIntents = React.useMemo(() => {
    return sortedCustomIntents.filter((intent) => {
      return intent.name.includes(search.trim());
    });
  }, [search, sortedCustomIntents]);

  const onDeleteIntent = (id: string) => {
    deleteIntent(id);
  };

  const validateName = (intentName: string, id: string) =>
    validateIntentName(
      intentName ?? '',
      allCustomIntents.filter((intent) => intent.id !== id),
      allSlots
    );

  const onRenameIntent = (newName: string, id: string) => {
    const formattedName = Utils.string.removeTrailingUnderscores(newName);
    const error = validateName(formattedName, id);

    if (error) {
      toast.error(error);
      return;
    }

    patchIntent(id, { id, name: formattedName });
  };

  const nameValidation = (name: string) => {
    return applyPlatformIntentNameFormatting(name, platform);
  };

  const onCreateIntent = async () => {
    const nextIntentID = await createIntent();
    setSelectedItemID(nextIntentID);
    setNewIntentID(nextIntentID);
    setIsCreating(true);
  };

  return (
    <SectionSection
      onClick={() => setActiveTab(InteractionModelTabType.INTENTS)}
      isExpanded={isActiveTab && !!filteredCustomIntents.length}
      header="Intents"
      forceDividers
      headerToggle
      collapseVariant={isActiveTab ? null : SectionToggleVariant.ARROW}
      isCollapsed={!isActiveTab}
      suffix={
        isActiveTab && (
          <TippyTooltip title="Create intent" position="top">
            <IconButton style={{ marginRight: -12 }} onClick={onCreateIntent} variant={IconButtonVariant.BASIC} icon="plus" />
          </TippyTooltip>
        )
      }
    >
      {isCreating && (
        <ListItem
          id={newIntentID}
          active={selectedID === newIntentID}
          onClick={() => setSelectedItemID(newIntentID)}
          key={newIntentID}
          name={allCustomIntentsMap[newIntentID].name}
          onDelete={onDeleteIntent}
          onRename={(name, id) => {
            setNewIntentID('');
            onRenameIntent(name, id);
            setIsCreating(false);
          }}
          nameValidation={nameValidation}
          isCreating
        />
      )}
      {filteredCustomIntents.map((intent) => (
        <ListItem
          id={intent.id}
          active={selectedID === intent.id}
          onClick={() => setSelectedItemID(intent.id)}
          key={intent.id}
          name={intent.name}
          onDelete={onDeleteIntent}
          onRename={onRenameIntent}
          nameValidation={nameValidation}
        />
      ))}
    </SectionSection>
  );
};

export default IntentSection;
