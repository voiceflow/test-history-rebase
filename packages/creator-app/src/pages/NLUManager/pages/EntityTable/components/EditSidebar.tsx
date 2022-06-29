import * as Realtime from '@voiceflow/realtime-sdk';
import React from 'react';

import EditEntityForm from '@/pages/Canvas/components/EntityModalsV2/components/EntityForm/EditEntityForm';

import { ItemEditSidebar } from '../../../components';
import { useNLUManager } from '../../../context';

const EditSidebar: React.FC = () => {
  const nluManager = useNLUManager<Realtime.Slot>();

  return (
    <ItemEditSidebar>
      {nluManager.activeItem && (
        <EditEntityForm
          slotID={nluManager.activeItem.id}
          withNameSection={false}
          withBottomDivider
          colorPopperModifiers={[{ name: 'offset', options: { offset: [-240, -25] } }]}
        />
      )}
    </ItemEditSidebar>
  );
};

export default EditSidebar;
