import React from 'react';

import Button, { ButtonVariant } from '@/components/Button';
import { ActionSection } from '@/components/Settings';
import { toast } from '@/components/Toast';
import * as Errors from '@/config/errors';
import * as Modal from '@/ducks/modal';
import * as Project from '@/ducks/project';
import * as Router from '@/ducks/router';
import * as Session from '@/ducks/session';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';
import * as Sentry from '@/vendors/sentry';

const DangerZone: React.FC<ConnectedDangerZoneProps> = ({ projectName, setConfirm, goToDashboard, projectID, deleteProject }) => {
  const handleDelete = async () => {
    if (!projectID) {
      Sentry.error(Errors.noActiveProjectID());
      toast.genericError();
      return;
    }

    try {
      goToDashboard();
      await deleteProject(projectID);
      toast.success(`Successfully deleted ${projectName}`);
    } catch (e) {
      toast.error(e.message);
    }
  };

  const deletePrompt = () => {
    setConfirm({
      text: <p className="mb-0">This action can not be undone, {projectName} and all flows can not be recovered</p>,
      warning: true,
      confirm: handleDelete,
    });
  };

  return (
    <ActionSection
      heading="Delete Project"
      description="This action cannot be reverted. Please proceed with caution."
      action={
        <Button variant={ButtonVariant.PRIMARY} onClick={deletePrompt}>
          Delete Project
        </Button>
      }
    />
  );
};

const mapStateToProps = {
  projectName: Skill.activeNameSelector,
  projectID: Session.activeProjectIDSelector,
};

const mapDispatchProps = {
  deleteProject: Project.deleteProject,
  goToDashboard: Router.goToDashboard,
  setConfirm: Modal.setConfirm,
};

type ConnectedDangerZoneProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchProps>;
export default connect(mapStateToProps, mapDispatchProps)(DangerZone);
