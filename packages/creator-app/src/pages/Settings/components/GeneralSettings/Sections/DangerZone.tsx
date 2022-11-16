import { Button, ButtonVariant } from '@voiceflow/ui';
import React from 'react';

import { ActionSection } from '@/components/Settings';
import * as ProjectV2 from '@/ducks/projectV2';
import * as Session from '@/ducks/session';
import { connect } from '@/hocs';
import { useDeleteProject } from '@/hooks';
import { ConnectedProps } from '@/types';

const DangerZone: React.FC<ConnectedDangerZoneProps> = ({ projectName, projectID }) => {
  const deletePrompt = useDeleteProject({
    projectID,
    projectName,
  });

  return (
    <ActionSection
      heading="Delete Assistant"
      description="This action cannot be reverted. Please proceed with caution."
      action={
        <Button variant={ButtonVariant.PRIMARY} onClick={deletePrompt}>
          Delete
        </Button>
      }
    />
  );
};

const mapStateToProps = {
  projectName: ProjectV2.active.nameSelector,
  projectID: Session.activeProjectIDSelector,
};

type ConnectedDangerZoneProps = ConnectedProps<typeof mapStateToProps>;

export default connect(mapStateToProps)(DangerZone);
