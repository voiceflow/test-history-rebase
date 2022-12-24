import React from 'react';

import manager from '@/ModalsV2/manager';

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
    ({ api, type, opened, hidden, importType: modalImportType, closePrevented, id, rendered }) => {
      const [importType, setImportType] = React.useState(modalImportType || ImportType.INTENT);
      const [animated, setAnimated] = React.useState(true);
      const Component = IMPORT_TYPE_COMPONENT_MAP[importType];
      const [tabState, setTabState] = React.useState<ModalsState>({
        [ImportType.INTENT]: { file: null, importedModel: null },
        [ImportType.UNCLASSIFIED]: { file: null },
      });

      React.useEffect(() => {
        if (opened) {
          setAnimated(false);
        }
      }, [opened]);

      return (
        <Component
          api={api}
          type={type}
          opened={opened}
          hidden={hidden}
          animated={animated}
          closePrevented={closePrevented}
          id={id}
          rendered={rendered}
          onChangeModalTab={setImportType}
          tabState={tabState}
          setTabState={setTabState}
        />
      );
    }
);

export default NLUImport;
