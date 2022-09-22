import React from 'react';

import * as Tracking from '@/ducks/tracking';
import EditEntityForm from '@/pages/Canvas/components/EntityModalsV2/components/EntityForm/EditEntityForm';

import { useNLUManager } from '../../../context';
import ItemEditSidebar from './ItemEditSidebar';

const EditSidebar: React.FC = () => {
  const nluManager = useNLUManager();

  return (
    <ItemEditSidebar>
      {nluManager.activeEntity && (
        <EditEntityForm
          slotID={nluManager.activeItemID}
          withNameSection={false}
          withBottomDivider
          colorPopperModifiers={[{ name: 'offset', options: { offset: [-240, -25] } }]}
          creationType={Tracking.NLUEntityCreationType.NLU_MANAGER}
        />
      )}
    </ItemEditSidebar>
  );
};

export default EditSidebar;
