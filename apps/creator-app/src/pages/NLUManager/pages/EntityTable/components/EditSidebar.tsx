import React from 'react';

import * as Tracking from '@/ducks/tracking';
import EditEntityForm from '@/pages/Canvas/components/EntityForm/EditEntityForm';

import { useNLUManager } from '../../../context';
import ItemEditSidebar from './ItemEditSidebar';

const EditSidebar: React.FC = () => {
  const nluManager = useNLUManager();

  return (
    <ItemEditSidebar>
      {nluManager.activeEntity && (
        <EditEntityForm
          key={nluManager.activeItemID}
          slotID={nluManager.activeItemID}
          creationType={Tracking.NLUEntityCreationType.NLU_MANAGER}
          withNameSection={false}
          withBottomDivider
          colorPopperModifiers={[{ name: 'offset', options: { offset: [-240, -25] } }]}
        />
      )}
    </ItemEditSidebar>
  );
};

export default EditSidebar;
