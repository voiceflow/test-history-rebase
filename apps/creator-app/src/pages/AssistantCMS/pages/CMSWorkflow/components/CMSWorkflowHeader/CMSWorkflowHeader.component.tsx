import { Header } from '@voiceflow/ui-next';
import React from 'react';

import { CMSHeader } from '../../../../components/CMSHeader/CMSHeader.component';
import { useOnWorkflowCreate } from '../../CMSWorkflow.hook';

export const CMSWorkflowHeader: React.FC = () => {
  const onCreate = useOnWorkflowCreate();

  return <CMSHeader searchPlaceholder="Search workflows" rightActions={<Header.Button.Primary label="New workflow" onClick={() => onCreate()} />} />;
};
