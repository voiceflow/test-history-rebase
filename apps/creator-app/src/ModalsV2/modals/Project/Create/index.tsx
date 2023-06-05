import { BaseModels } from '@voiceflow/base-types';
import { Nullable } from '@voiceflow/common';
import { UserRole } from '@voiceflow/internal';
import * as Platform from '@voiceflow/platform-config';
import { FullSpinner, Modal, Portal, Switch, System, useSmartReducerV2 } from '@voiceflow/ui';
import React from 'react';

import * as Assistant from '@/components/Assistant';
import * as Account from '@/ducks/account';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks/redux';
import { useGetAIAssistSettings } from '@/ModalsV2/modals/Disclaimer/hooks/aiPlayground';
import { ClassName } from '@/styles/constants';

import manager from '../../../manager';
import { Screen } from './constants';
import { useProjectCreate } from './hooks';
import { Members, Name } from './screens';

const Create = manager.create('CreateProject', () => ({ api, type, opened, hidden, animated }) => {
  const userID = useSelector(Account.userIDSelector)!;
  const userMember = useSelector(WorkspaceV2.active.memberByIDSelector, { creatorID: userID });
  const getAIAssistSettings = useGetAIAssistSettings();

  const [state, stateAPI] = useSmartReducerV2({
    name: '',
    image: null as Nullable<string>,
    screen: Screen.NAME,
    members: (userMember ? [{ ...userMember, role: UserRole.EDITOR }] : []) as Assistant.Member[],
    creating: false,
    platform: null as Nullable<Platform.Constants.PlatformType>,
    aiAssistSettings: null as Nullable<BaseModels.Project.AIAssistSettings>,
  });

  const onCreateProject = useProjectCreate();

  const onNameNext = async ({ name, image }: { name: string; image: Nullable<string> }) => {
    const aiAssistSettings = await getAIAssistSettings();

    if (!aiAssistSettings) return;

    stateAPI.update({ name, image, screen: Screen.MEMBERS, aiAssistSettings });
  };

  const onBack = () => {
    stateAPI.update({ screen: Screen.NAME });
  };

  const onFinish = async () => {
    if (!state.name) return;

    try {
      stateAPI.update({ creating: true });

      await onCreateProject({
        name: state.name,
        image: state.image,
        members: state.members.map((member) => ({ role: member.role, creatorID: member.creator_id })),
        aiAssistSettings: state.aiAssistSettings,
      });

      api.close();
    } catch {
      stateAPI.update({ creating: false });
    }
  };

  const onAddMember = (member: Assistant.Member) => {
    stateAPI.update(({ members }) => ({ members: [...members, member] }));
  };

  const onRemoveMember = (memberID: number) => {
    stateAPI.update(({ members }) => ({ members: members.filter((member) => member.creator_id !== memberID) }));
  };

  const onChangeMemberRole = (memberID: number, role: Assistant.Member['role']) => {
    stateAPI.update(({ members }) => ({ members: members.map((member) => (member.creator_id === memberID ? { ...member, role } : member)) }));
  };

  return (
    <>
      <Modal
        type={type}
        opened={opened}
        hidden={hidden}
        animated={animated}
        onExited={api.remove}
        maxWidth={450}
        className={`${ClassName.MODAL}--create-project`}
      >
        <Modal.Header border actions={<Modal.Header.CloseButtonAction onClick={() => api.close()} />}>
          {state.screen !== Screen.NAME && (
            <System.IconButtonsGroup.Base mr={12}>
              <System.IconButton.Base icon="largeArrowLeft" onClick={() => onBack()} />
            </System.IconButtonsGroup.Base>
          )}

          <Modal.Header.Title large>Create Assistant</Modal.Header.Title>
        </Modal.Header>

        <Switch active={state.screen}>
          <Switch.Pane value={Screen.NAME}>
            <Name name={state.name} image={state.image} onNext={onNameNext} onClose={api.close} />
          </Switch.Pane>

          <Switch.Pane value={Screen.MEMBERS}>
            <Members
              onAdd={onAddMember}
              onNext={onFinish}
              members={state.members}
              onClose={api.close}
              onRemove={onRemoveMember}
              onChangeRole={onChangeMemberRole}
            />
          </Switch.Pane>
        </Switch>
      </Modal>

      {state.creating && (
        <Portal portalNode={document.body}>
          <FullSpinner message="Creating assistant" backgroundColor="#fff" zIndex={1100} />
        </Portal>
      )}
    </>
  );
});

export default Create;
