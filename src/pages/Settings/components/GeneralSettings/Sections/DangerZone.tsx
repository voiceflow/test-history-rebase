import React from 'react';

import Button, { ButtonVariant } from '@/components/Button';
import { ActionSection } from '@/components/Settings';
import { toast } from '@/components/Toast';
import * as Modal from '@/ducks/modal';
import * as Project from '@/ducks/project';
import * as Router from '@/ducks/router';
import * as Skill from '@/ducks/skill';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';

const DangerZone: React.FC<ConnectedDangerZoneProps> = ({ activeSkill, setConfirm, goToDashboard, activeProjectId, deleteProject }) => {
  const { name } = activeSkill;

  const handleDelete = async () => {
    try {
      await deleteProject(activeProjectId);
      goToDashboard();
      toast.success(`Successfully deleted ${name}`);
    } catch (e) {
      toast.error(e.message);
    }
  };

  const deletePrompt = () => {
    setConfirm({
      text: <p className="mb-0">This action can not be undone, {name} and all flows can not be recovered</p>,
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
  activeProjectId: Skill.activeProjectIDSelector,
  activeSkill: Skill.activeSkillSelector,
};

const mapDispatchProps = {
  deleteProject: Project.deleteProject,
  goToDashboard: Router.goToDashboard,
  setConfirm: Modal.setConfirm,
};

type ConnectedDangerZoneProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchProps>;
export default connect(mapStateToProps, mapDispatchProps)(DangerZone);
