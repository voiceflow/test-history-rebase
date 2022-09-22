import React from 'react';

import * as Tracking from '@/ducks/tracking';
import EditIntentForm from '@/pages/Canvas/components/IntentModalsV2/components/IntentForm/EditIntentForm';
import { EditorTabs } from '@/pages/NLUManager/constants';
import { useNLUManager } from '@/pages/NLUManager/context';
import { isCustomizableBuiltInIntent } from '@/utils/intent';

import Conflicts from '../Conflicts';
import ItemEditSidebar from '../ItemEditSidebar';
import { CardList, Recommendations } from './components';

const EditSidebar: React.FC = () => {
  const nluManager = useNLUManager();

  const showEditorTab = (tab: EditorTabs) => nluManager.activeItemID && nluManager.isEditorTabActive(tab);

  const handleConflictChangesApplied = () => {
    setTimeout(nluManager.fetchClarity, 2000);
  };

  return (
    <>
      <ItemEditSidebar isBuiltIn={isCustomizableBuiltInIntent(nluManager.activeIntent)}>
        {nluManager.activeIntent && (
          <>
            <CardList intent={nluManager.activeIntent} />
            <EditIntentForm
              intentID={nluManager.activeItemID}
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
