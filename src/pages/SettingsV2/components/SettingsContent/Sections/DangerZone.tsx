import React from 'react';

import Button, { ButtonVariant } from '@/components/Button';
import { FlexApart } from '@/components/Flex';
import { toast } from '@/components/Toast';
import * as Modal from '@/ducks/modal';
import * as Project from '@/ducks/project';
import * as Router from '@/ducks/router';
import * as Skill from '@/ducks/skill';
import { connect, styled } from '@/hocs';
import { ConnectedProps } from '@/types';

const Container = styled(FlexApart)`
  padding: 29px 32px;
`;

const LeftSection = styled.div`
  flex: 3;
`;

const RightSection = styled.div`
  flex: 1;
`;

const Heading = styled.div`
  color: #62778c;
  margin-bottom: 8px;
  font-size: 15px;
  font-weight: 600;
`;

const Description = styled.div`
  color: #62778c;
  font-size: 13px;
`;

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
    <Container>
      <LeftSection>
        <Heading>Delete Project</Heading>
        <Description>This action cannot be reverted. Please proceed with caution.</Description>
      </LeftSection>
      <RightSection>
        <Button variant={ButtonVariant.PRIMARY} onClick={deletePrompt}>
          Delete Project
        </Button>
      </RightSection>
    </Container>
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
