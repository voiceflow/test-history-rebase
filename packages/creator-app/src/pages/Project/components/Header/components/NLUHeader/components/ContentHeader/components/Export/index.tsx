import { Button, ButtonVariant, Popper } from '@voiceflow/ui';
import React from 'react';

import {
  ExportContent,
  ExportFooter,
  ExportProvider,
  FooterWrapper,
} from '@/pages/Project/components/Header/components/SharePopper/components/Export';

interface ExportProps {
  checkedItems: string[];
}

const Export: React.FC<ExportProps> = ({ checkedItems }) => {
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
          <FooterWrapper>
            <ExportFooter withoutLink />
          </FooterWrapper>
        )}
      >
        {({ ref }) => (
          <Button squareRadius flat variant={ButtonVariant.SECONDARY} onClick={() => setIsOpened(true)} ref={ref}>
            Export
            {!!checkedItems.length && ` (${checkedItems.length})`}
          </Button>
        )}
      </Popper>
    </ExportProvider>
  );
};

export default Export;
