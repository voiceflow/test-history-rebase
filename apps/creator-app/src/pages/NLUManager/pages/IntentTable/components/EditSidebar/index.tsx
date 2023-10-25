import React from 'react';

import EntityPromptForm from '@/components/LegacyNLU/EntityPromptForm';
import * as Tracking from '@/ducks/tracking';
import EditIntentForm from '@/ModalsV2/modals/NLU/Intent/components/EditIntentForm';
import { EditorTabs } from '@/pages/NLUManager/constants';
import { useNLUManager } from '@/pages/NLUManager/context';
import { isCustomizableBuiltInIntent } from '@/utils/intent';

import Conflicts from '../Conflicts';
import ItemEditSidebar from '../ItemEditSidebar';
import { CardList } from './components';

const EditSidebar: React.FC = () => {
  const nluManager = useNLUManager();

  const [entityPromptSlotID, setEntityPromptSlotID] = React.useState('');
  const [entityPromptAutogenerate, setEntityPromptAutogenerate] = React.useState(false);

  const onEnterEntityPrompt = (slotID: string, { autogenerate = false }: { autogenerate?: boolean } = {}) => {
    setEntityPromptSlotID(slotID);
    setEntityPromptAutogenerate(autogenerate);
  };

  const onEntityPromptBack = () => {
    setEntityPromptSlotID('');
    setEntityPromptAutogenerate(false);
  };

  const showEditorTab = (tab: EditorTabs) => nluManager.activeItemID && nluManager.isEditorTabActive(tab);

  return (
    <>
      <ItemEditSidebar isBuiltIn={isCustomizableBuiltInIntent(nluManager.activeIntent)} onBack={entityPromptSlotID ? onEntityPromptBack : undefined}>
        {nluManager.activeIntent &&
          (entityPromptSlotID ? (
            <EntityPromptForm intentID={nluManager.activeIntent.id} entityID={entityPromptSlotID} autogenerate={entityPromptAutogenerate} />
          ) : (
            <>
              <CardList intent={nluManager.activeIntent} />

              <EditIntentForm
                // should remount when selectedID changes, otherwise, it can use the wrong intentID to patch the intent
                key={nluManager.activeItemID}
                intentID={nluManager.activeItemID}
                isNLUManager
                creationType={Tracking.IntentEditType.NLU_MANAGER}
                onEnterEntityPrompt={onEnterEntityPrompt}
                utteranceCreationType={Tracking.CanvasCreationType.NLU_MANAGER}
              />
            </>
          ))}
      </ItemEditSidebar>

      {showEditorTab(EditorTabs.INTENT_CONFLICTS) && <Conflicts />}
    </>
  );
};

export default EditSidebar;
