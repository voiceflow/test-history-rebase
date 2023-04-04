import { Button, ButtonVariant, Popper } from '@voiceflow/ui';
import React from 'react';

import * as Project from '@/components/Project';
import { NLU_MANAGEMENT_NLU_DATA_EXPORT } from '@/config/documentation';
import * as Tracking from '@/ducks/tracking';

interface ExportProps {
  checkedItems: string[];
}

const Export: React.FC<ExportProps> = ({ checkedItems }) => {
  const [opened, setIsOpened] = React.useState(false);

  return (
    <Project.Export.Provider>
      <Popper
        width="450px"
        height="300px"
        opened={opened}
        onClose={() => setIsOpened(false)}
        renderContent={() => <Project.Export.Content withDataTypes={false} checkedItems={checkedItems} />}
        renderFooter={() => (
          <Popper.Footer height="134px" backgroundColor="#fdfdfd">
            <Project.Export.Footer withoutLink origin={Tracking.ModelExportOriginType.NLU_MANAGER} linkURL={NLU_MANAGEMENT_NLU_DATA_EXPORT} />
          </Popper.Footer>
        )}
      >
        {({ ref }) => (
          <Button variant={ButtonVariant.SECONDARY} onClick={() => setIsOpened(true)} ref={ref}>
            Export
            {!!checkedItems.length && ` (${checkedItems.length})`}
          </Button>
        )}
      </Popper>
    </Project.Export.Provider>
  );
};

export default Export;
