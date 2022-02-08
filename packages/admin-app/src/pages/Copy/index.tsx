/* eslint-disable no-underscore-dangle */
import { Constants } from '@voiceflow/general-types';
import { Button, ButtonVariant, KeyName, Label, toast } from '@voiceflow/ui';
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Select from 'react-select';

import client, { Admin } from '@/client';
import { PageTitle } from '@/components/PageLayout';
import * as AccountV2 from '@/ducks/accountV2';
import { CopyContent, CopyFields, ToField } from '@/pages/Copy/styles';

const blurOnEnter = (event: React.KeyboardEvent<HTMLInputElement>) => {
  if (event.key === KeyName.ENTER) {
    event.preventDefault();
    event.currentTarget.blur();
  }
};

interface BoardOption {
  label: string;
  value: number;
}

interface SkillOption {
  label: string;
  value: string;
  platform: string;
}

const Copy: React.FC = () => {
  const user = useSelector(AccountV2.accountSelector);

  const [skill, setSkill] = React.useState<SkillOption | null>(null);
  const [boards, setBoards] = React.useState<BoardOption[]>([]);
  const [creatorID, setCreatorID] = React.useState('');
  const [targetBoard, setTargetBoard] = React.useState<BoardOption | null>(null);
  const [targetUserID, setTargetUserID] = React.useState('');
  const [creatorSkills, setCreatorSkills] = React.useState<SkillOption[]>([]);

  const onCreatorIDBlur = async () => {
    if (Number.isNaN(Number(creatorID))) {
      return;
    }

    try {
      const { boards } = await Admin.getCreatorByID(Number(creatorID));

      setCreatorSkills(
        Object.values(boards).flatMap(({ projects }) =>
          projects.map((project) => ({
            label: `${project.name} - ${project._id} ${(project.version?.platformData as any)?.status?.stage === 'LIVE' ? '(Live)' : ''}`,
            value: project._id,
            platform: project.platform,
          }))
        )
      );
    } catch (error) {
      toast.error('Something went wrong, please check the console');
      console.error(error);
    }
  };

  const fetchTargetUserBoards = async (targetUserID: number) => {
    try {
      const teams = await Admin.getUserTeams(+targetUserID);

      setBoards(
        teams.map((t) => ({
          label: `${t.name} - ${t.team_id}`,
          value: t.team_id,
        }))
      );
    } catch (err) {
      toast.error('Something went wrong, please check the console');
      console.error(err);
    }
  };

  const onTargetUserIDBlur = async () => {
    if (!Number.isNaN(Number(targetUserID))) {
      await fetchTargetUserBoards(Number(targetUserID));
    }
  };

  const onClickToMe = () => {
    if (user.id) {
      setTargetUserID(String(user.id));
      fetchTargetUserBoards(user.id);
    }
  };

  const onCopy = async () => {
    if (!(creatorID && skill && targetBoard)) {
      toast.error('Fields not Complete!');
      return;
    }

    try {
      await client.platform(skill.platform as Constants.PlatformType).project.copy(skill.value, { teamID: targetBoard.value });

      setSkill(null);
      setCreatorID('');
      setTargetBoard(null);
      setTargetUserID('');

      toast.success('Project copied successfully!');
    } catch (err) {
      toast.error('Error');
    }
  };

  return (
    <>
      <PageTitle>Copy Project</PageTitle>

      <hr />

      <CopyContent>
        <CopyFields>
          <Label>COPY</Label>

          <input
            type="text"
            value={creatorID}
            onBlur={onCreatorIDBlur}
            onChange={({ currentTarget }) => setCreatorID(currentTarget.value)}
            className="form-control"
            onKeyPress={blurOnEnter}
            placeholder="Enter Creator ID"
          />

          <Select
            value={skill}
            options={creatorSkills}
            onChange={(value) => setSkill(value ?? null)}
            className="select-box mb-2"
            placeholder="Select Skill"
            classNamePrefix="select-box"
          />

          {skill && (
            <>
              <i className="far fa-search text-dull mr-1" />
              <Link to={`/admin/lookup/${skill.value}`}>{skill.value}</Link>
            </>
          )}
        </CopyFields>

        <CopyFields>
          <Label>TO</Label>

          <ToField>
            <input
              type="text"
              value={targetUserID}
              onBlur={onTargetUserIDBlur}
              onChange={({ currentTarget }) => setTargetUserID(currentTarget.value)}
              className="form-control"
              onKeyPress={blurOnEnter}
              placeholder="Enter Target User ID"
            />

            <Button variant={ButtonVariant.SECONDARY} onClick={onClickToMe}>
              Myself
            </Button>
          </ToField>

          <Select
            value={targetBoard}
            options={boards}
            onChange={(board) => setTargetBoard(board ?? null)}
            className="select-box mb-2"
            placeholder="Select Workspace"
            classNamePrefix="select-box"
          />
        </CopyFields>
      </CopyContent>

      <Button variant={ButtonVariant.PRIMARY} onClick={onCopy} className="mb-2">
        Copy
      </Button>
    </>
  );
};

export default Copy;
