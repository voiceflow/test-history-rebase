import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import EditIntentForm from '@/pages/Canvas/components/IntentModalsV2/components/IntentForm/EditIntentForm';
import { ItemEditSidebar } from '@/pages/NLUManager/components';
import { useNLUManager } from '@/pages/NLUManager/context';
import { isCustomizableBuiltInIntent } from '@/utils/intent';

import { CardList, Recommendations } from './components';

const EditSidebar: React.FC = () => {
  const nluManager = useNLUManager<Realtime.Intent>();

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

      {nluManager.activeItem && <Recommendations />}
    </>
  );
};

export default EditSidebar;
