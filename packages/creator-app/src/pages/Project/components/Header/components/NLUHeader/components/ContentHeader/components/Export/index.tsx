import { Button, ButtonVariant, Popper } from '@voiceflow/ui';
import React from 'react';

import { InteractionModelTabType } from '@/constants';
import {
  ExportContent,
  ExportFooter,
  ExportProvider,
  FooterWrapper,
} from '@/pages/Project/components/Header/components/SharePopper/components/Export';

interface ExportProps {
  checkedItems: string[];
  activeTab: InteractionModelTabType;
}

const Export: React.FC<ExportProps> = ({ checkedItems, activeTab }) => {
  const [opened, setIsOpened] = React.useState(false);

  return (
    <ExportProvider compilerOptions={{ renderUnusedIntents: true }}>
      <Popper
        width="450px"
        height="300px"
        opened={opened}
        onClose={() => setIsOpened(false)}
        renderContent={() => <ExportContent withDataTypes={false} checkedItems={checkedItems} />}
        renderFooter={() => (
          <FooterWrapper style={{ height: '134px' }}>
            <ExportFooter withoutLink />
          </FooterWrapper>
        )}
      >
        {({ ref }) => (
          <Button squareRadius flat variant={ButtonVariant.SECONDARY} onClick={() => setIsOpened(true)} ref={ref}>
            Export
            {activeTab === InteractionModelTabType.INTENTS && !!checkedItems.length && ` (${checkedItems.length})`}
          </Button>
        )}
      </Popper>
    </ExportProvider>
  );
};

export default Export;
