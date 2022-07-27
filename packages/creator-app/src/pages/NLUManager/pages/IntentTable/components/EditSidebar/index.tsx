import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import EditIntentForm from '@/pages/Canvas/components/IntentModalsV2/components/IntentForm/EditIntentForm';
import { ItemEditSidebar } from '@/pages/NLUManager/components';
import { EditorTabs } from '@/pages/NLUManager/constants';
import { useNLUManager } from '@/pages/NLUManager/context';
import { isCustomizableBuiltInIntent } from '@/utils/intent';

import Conflicts from '../Conflicts';
import { CardList, Recommendations } from './components';

const EditSidebar: React.FC = () => {
  const nluManager = useNLUManager<Realtime.Intent>();

  const showEditorTab = (tab: EditorTabs) => nluManager.activeItem?.id && nluManager.isEditorTabActive(tab);

  return (
    <>
      <ItemEditSidebar isBuiltIn={isCustomizableBuiltInIntent(nluManager.activeItem)}>
        {nluManager.activeItem && (
          <>
            <CardList intentID={nluManager.activeItem.id} />
            <EditIntentForm intentID={nluManager.activeItem.id} isNLUManager />
          </>
        )}
      </ItemEditSidebar>

      {showEditorTab(EditorTabs.UTTERANCE_RECOMMENDATIONS) && <Recommendations />}
      {showEditorTab(EditorTabs.INTENT_CONFLICTS) && <Conflicts />}
    </>
  );
};

export default EditSidebar;
