import { Modal } from '@voiceflow/ui';
import React from 'react';

import * as Project from '@/components/Project';
import { MODEL_EXPORT } from '@/config/documentation';
import * as Tracking from '@/ducks/tracking';

import manager from '../../manager';

interface Props {
  checkedItems: string[];
}

const Export = manager.create<Props>('NLUExport', () => ({ api, type, opened, hidden, animated, checkedItems }) => (
  <Project.Export.Provider>
    <Modal type={type} opened={opened} hidden={hidden} animated={animated} onExited={api.remove} maxWidth={450}>
      <Modal.Header>NLU Export</Modal.Header>

      <Modal.Body>
        <Project.Export.Model selectedIntentsIds={checkedItems} />
      </Modal.Body>

      <Modal.Footer>
        <Project.Export.Footer
          origin={Tracking.ModelExportOriginType.NLU_MANAGER}
          linkURL={MODEL_EXPORT}
          withoutLink={true}
          selectedItems={checkedItems}
        />
      </Modal.Footer>
    </Modal>
  </Project.Export.Provider>
));

export default Export;
