import { Modal } from '@voiceflow/ui';
import React from 'react';

import manager from '@/ModalsV2/manager';
import { NLUManagerProvider } from '@/pages/NLUManager/context';

import { ImportIntents, ImportUnclassifiedData } from './components';
import { ImportType } from './constants';
import { ModalsState } from './types';

export * from './constants';

const IMPORT_TYPE_COMPONENT_MAP = {
  [ImportType.INTENT]: ImportIntents,
  [ImportType.UNCLASSIFIED]: ImportUnclassifiedData,
};

const NLUImport = manager.create<{ importType: ImportType }>(
  'NLUImport',
  () =>
    ({ id, api, type, opened, hidden, importType: modalImportType, closePrevented, animated, rendered }) => {
      const [importType, setImportType] = React.useState(modalImportType);

      const [tabState, setTabState] = React.useState<ModalsState>({
        [ImportType.INTENT]: { file: null, importedModel: null },
        [ImportType.UNCLASSIFIED]: { file: null },
      });

      const Component = IMPORT_TYPE_COMPONENT_MAP[importType];

      return (
        <Modal type={type} maxWidth={450} opened={opened} hidden={hidden} animated={animated} onExited={api.remove}>
          <NLUManagerProvider>
            <Component
              id={id}
              api={api}
              type={type}
              opened={opened}
              hidden={hidden}
              animated={animated}
              rendered={rendered}
              tabState={tabState}
              setTabState={setTabState}
              closePrevented={closePrevented}
              onChangeModalTab={setImportType}
            />
          </NLUManagerProvider>
        </Modal>
      );
    }
);

export default NLUImport;
