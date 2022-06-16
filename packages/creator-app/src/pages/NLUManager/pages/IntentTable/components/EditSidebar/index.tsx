import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import EditIntentForm from '@/pages/Canvas/components/IntentModalsV2/components/IntentForm/EditIntentForm';

import { ItemEditSidebar } from '../../../../components';
import { useNLUManager } from '../../../../context';
import { CardList } from './components';

const EditSidebar: React.FC = () => {
  const nluManager = useNLUManager<Realtime.Slot>();

  return (
    <ItemEditSidebar>
      {nluManager.activeItem && (
        <>
          <CardList intentID={nluManager.activeItem.id} />
          <EditIntentForm intentID={nluManager.activeItem.id} rightSlider />
        </>
      )}
    </ItemEditSidebar>
  );
};

export default EditSidebar;
