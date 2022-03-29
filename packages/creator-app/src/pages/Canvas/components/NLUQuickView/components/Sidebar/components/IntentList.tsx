import * as Realtime from '@voiceflow/realtime-sdk';
import { IconButton, IconButtonVariant, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { SectionToggleVariant } from '@/components/Section';
import { InteractionModelTabType, ModalType } from '@/constants';
import * as Intent from '@/ducks/intent';
import * as IntentV2 from '@/ducks/intentV2';
import { useDispatch, useModals, useSelector } from '@/hooks';
import { NLUQuickViewContext } from '@/pages/Canvas/components/NLUQuickView/context';

import { useFilteredList, useOrderedIntents } from '../../../hooks';
import { useSectionHooks } from '../hooks';
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
  const { open: openIntentCreate } = useModals(ModalType.INTENT_CREATE);
  const { onRenameIntent, nameChangeTransform, activeTab } = React.useContext(NLUQuickViewContext);

  const allIntents = useSelector(IntentV2.allIntentsSelector);
  const allCustomIntentsMap = useSelector(IntentV2.customIntentMapSelector);
  const isActiveTab = React.useMemo(() => activeTab === InteractionModelTabType.INTENTS, [activeTab]);

  const deleteIntent = useDispatch(Intent.deleteIntent);

  const { sortedIntents } = useOrderedIntents();

  const filteredList = useFilteredList(search, sortedIntents) as Realtime.Intent[];

  useSectionHooks({
    setSearchLength,
    listLength: allIntents.length,
    isActiveTab,
    map: allCustomIntentsMap,
  });

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
      isExpanded={isActiveTab && !!filteredList.length}
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
      {filteredList.map((intent, index) => (
        <ListItem
          id={intent.id}
          type={InteractionModelTabType.VARIABLES}
          active={selectedID ? selectedID === intent.id : index === 0}
          onClick={() => setSelectedItemID(intent.id)}
          key={intent.id}
          name={intent.name}
          onDelete={onDeleteIntent}
          onRename={onRenameIntent}
          nameValidation={(name) => nameChangeTransform(name, InteractionModelTabType.INTENTS)}
          setIsActiveItemRename={setIsActiveItemRename}
          isActiveItemRename={isActiveItemRename}
        />
      ))}
    </SectionSection>
  );
};

export default IntentList;
