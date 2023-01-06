import { Button, ButtonVariant, Popper } from '@voiceflow/ui';
import React from 'react';

import { NLU_MANAGEMENT_NLU_DATA_EXPORT } from '@/config/documentation';
import * as Tracking from '@/ducks/tracking';
import {
  ExportContent,
  ExportFooter,
  ExportProvider,
  FooterWrapper,
} from '@/pages/Project/components/Header/components/SharePopper/components/Export';

interface ExportProps {
  checkedItems: string[];
}

const Export: React.OldFC<ExportProps> = ({ checkedItems }) => {
  const [opened, setIsOpened] = React.useState(false);

  return (
    <ExportProvider>
      <Popper
        width="450px"
        height="300px"
        opened={opened}
        onClose={() => setIsOpened(false)}
        renderContent={() => <ExportContent withDataTypes={false} checkedItems={checkedItems} />}
        renderFooter={() => (
          <FooterWrapper style={{ height: '134px' }}>
            <ExportFooter withoutLink origin={Tracking.ModelExportOriginType.NLU_MANAGER} linkURL={NLU_MANAGEMENT_NLU_DATA_EXPORT} />
          </FooterWrapper>
        )}
      >
        {({ ref }) => (
          <Button variant={ButtonVariant.SECONDARY} onClick={() => setIsOpened(true)} ref={ref}>
            Export
            {!!checkedItems.length && ` (${checkedItems.length})`}
          </Button>
        )}
      </Popper>
    </ExportProvider>
  );
};

export default Export;
