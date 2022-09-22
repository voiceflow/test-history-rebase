import React from 'react';

import * as Tracking from '@/ducks/tracking';
import EditIntentForm from '@/pages/Canvas/components/IntentModalsV2/components/IntentForm/EditIntentForm';
import { ItemEditSidebar } from '@/pages/NLUManager/components';
import { EditorTabs } from '@/pages/NLUManager/constants';
import { useNLUManager } from '@/pages/NLUManager/context';
import { NLUIntent } from '@/pages/NLUManager/types';
import { isCustomizableBuiltInIntent } from '@/utils/intent';

import Conflicts from '../Conflicts';
import { CardList, Recommendations } from './components';

const EditSidebar: React.FC = () => {
  const nluManager = useNLUManager<NLUIntent>();

  const showEditorTab = (tab: EditorTabs) => nluManager.activeItem?.id && nluManager.isEditorTabActive(tab);

  const handleConflictChangesApplied = () => {
    setTimeout(nluManager.fetchClarity, 2000);
  };

  return (
    <>
      <ItemEditSidebar isBuiltIn={isCustomizableBuiltInIntent(nluManager.activeItem)}>
        {nluManager.activeItem && (
          <>
            <CardList intent={nluManager.activeItem} />
            <EditIntentForm
              intentID={nluManager.activeItem.id}
              isNLUManager
              creationType={Tracking.IntentEditType.NLU_MANAGER}
              utteranceCreationType={Tracking.CanvasCreationType.NLU_MANAGER}
            />
          </>
        )}
      </ItemEditSidebar>

      {showEditorTab(EditorTabs.UTTERANCE_RECOMMENDATIONS) && <Recommendations />}
      {showEditorTab(EditorTabs.INTENT_CONFLICTS) && <Conflicts onChangesApplied={handleConflictChangesApplied} />}
    </>
  );
};

export default EditSidebar;
