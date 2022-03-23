import { IconButton, IconButtonVariant, TippyTooltip } from '@voiceflow/ui';
import _sortBy from 'lodash/sortBy';
import React from 'react';

import { SectionToggleVariant } from '@/components/Section';
import { InteractionModelTabType, ModalType } from '@/constants';
import * as Intent from '@/ducks/intent';
import * as IntentV2 from '@/ducks/intentV2';
import { useDispatch, useModals, useSelector } from '@/hooks';
import { NLUQuickViewContext } from '@/pages/Canvas/components/NLUQuickView/context';
import { isCustomizableBuiltInIntent } from '@/utils/intent';

import { useSectionHooks } from '../hooks';
import { SectionSection } from '.';
import ListItem from './ListItem';
import { SectionProps } from './types';

const IntentSection: React.FC<SectionProps> = ({
  setIsActiveItemRename,
  isActiveItemRename,
  setSearchLength,
  search,
  selectedID,
  setActiveTab,
  setSelectedItemID,
}) => {
  const { open: openIntentCreate } = useModals(ModalType.INTENT_CREATE);
  const { onRenameIntent, nameChangeTransform, activeTab } = React.useContext(NLUQuickViewContext);

  const allCustomIntents = useSelector(IntentV2.allCustomIntentsSelector);
  const allCustomIntentsMap = useSelector(IntentV2.customIntentMapSelector);
  const isActiveTab = React.useMemo(() => activeTab === InteractionModelTabType.INTENTS, [activeTab]);

  const deleteIntent = useDispatch(Intent.deleteIntent);

  const sortedCustomIntents = React.useMemo(
    () => _sortBy(allCustomIntents, isCustomizableBuiltInIntent, (intent) => intent.name.toLowerCase()),
    [allCustomIntents]
  );

  useSectionHooks({
    setSearchLength,
    listLength: allCustomIntents.length,
    isActiveTab,
    list: sortedCustomIntents,
    map: allCustomIntentsMap,
  });

  const filteredCustomIntents = React.useMemo(() => {
    return sortedCustomIntents.filter((intent) => {
      return intent.name.includes(search.trim());
    });
  }, [search, sortedCustomIntents]);

  const onDeleteIntent = (id: string) => {
    deleteIntent(id);
  };

  const onCreateIntent = () => {
    openIntentCreate({
      onCreate: (id: string) => {
        setSelectedItemID(id);
      },
    });
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
      {filteredCustomIntents.map((intent) => (
        <ListItem
          id={intent.id}
          active={selectedID === intent.id}
          onClick={() => setSelectedItemID(intent.id)}
          key={intent.id}
          name={intent.name}
          onDelete={onDeleteIntent}
          onRename={onRenameIntent}
          nameValidation={nameChangeTransform}
          setIsActiveItemRename={setIsActiveItemRename}
          isActiveItemRename={isActiveItemRename}
        />
      ))}
    </SectionSection>
  );
};

export default IntentSection;
