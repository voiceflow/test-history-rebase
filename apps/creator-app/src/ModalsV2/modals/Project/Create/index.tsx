import { Nullable } from '@voiceflow/common';
import { UserRole } from '@voiceflow/dtos';
import * as Platform from '@voiceflow/platform-config';
import { Modal, Portal, Switch, System, useSmartReducerV2 } from '@voiceflow/ui';
import { TabLoader } from '@voiceflow/ui-next';
import React from 'react';

import * as Assistant from '@/components/Assistant';
import * as Account from '@/ducks/account';
import * as WorkspaceV2 from '@/ducks/workspaceV2';
import { useSelector } from '@/hooks/redux';
import { NLUImportModel } from '@/models';
import { ClassName } from '@/styles/constants';

import manager from '../../../manager';
import { Screen } from './constants';
import { useProjectCreate } from './hooks';
import { Members, Setup } from './screens';

const Create = manager.create<{ listID?: string }>('CreateProject', () => ({ api, type, opened, listID, hidden, animated, closePrevented }) => {
  const userID = useSelector(Account.userIDSelector)!;
  const userMember = useSelector(WorkspaceV2.active.memberByIDSelector, { creatorID: userID });

  const [state, stateAPI] = useSmartReducerV2({
    name: '',
    type: null as Nullable<Platform.Constants.ProjectType>,
    image: null as Nullable<string>,
    screen: Screen.SETUP,
    members: (userMember ? [{ ...userMember, role: UserRole.EDITOR }] : []) as Assistant.Member[],
    locales: [] as string[],
    creating: false,
    platform: null as Nullable<Platform.Constants.PlatformType>,
    secondScreen: null as Nullable<Screen.MEMBERS>,
    importedModel: null as Nullable<NLUImportModel>,
    aiAssistSettings: { aiPlayground: true },
  });

  const onCreateProject = useProjectCreate();

  const onSetupNext = async ({ name, image }: { name: string; image: Nullable<string> }) => {
    stateAPI.update({ name, image });
    stateAPI.update({ screen: Screen.MEMBERS });
  };

  const onChangeType = (type: Platform.Constants.ProjectType | null, platform: Platform.Constants.PlatformType | null) => {
    stateAPI.platform.set(platform);
    stateAPI.type.set(type);
  };

  const onBack = () => {
    if (state.screen === Screen.MEMBERS && state.secondScreen) {
      stateAPI.update({ screen: state.secondScreen });
    } else {
      stateAPI.update({ screen: Screen.SETUP });
    }
  };

  const onFinish = async () => {
    if (!state.type || !state.platform) return;

    try {
      api.preventClose();
      stateAPI.update({ creating: true });

      await onCreateProject({
        name: state.name,
        type: state.type,
        image: state.image,
        listID,
        members: state.members.map((member) => ({ role: member.role, creatorID: member.creator_id })),
        locales: state.locales,
        platform: state.platform,
        importedModel: state.importedModel,
        aiAssistSettings: state.aiAssistSettings,
      });

      api.enableClose();
      api.close();
    } catch {
      api.enableClose();
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
        <Modal.Header border actions={<Modal.Header.CloseButtonAction onClick={api.onClose} />}>
          {state.screen !== Screen.SETUP && (
            <System.IconButtonsGroup.Base mr={12}>
              <System.IconButton.Base icon="largeArrowLeft" onClick={() => onBack()} />
            </System.IconButtonsGroup.Base>
          )}

          <Modal.Header.Title large>Create Assistant</Modal.Header.Title>
        </Modal.Header>

        <Switch active={state.screen}>
          <Switch.Pane value={Screen.SETUP}>
            <Setup
              name={state.name}
              image={state.image}
              type={state.type}
              onNext={onSetupNext}
              onClose={api.onClose}
              locales={state.locales}
              platform={state.platform}
              importModel={state.importedModel}
              onChangeType={onChangeType}
              onImportModel={stateAPI.importedModel.set}
              onChangeLocales={stateAPI.locales.set}
            />
          </Switch.Pane>

          <Switch.Pane value={Screen.MEMBERS}>
            <Members
              onAdd={onAddMember}
              onNext={onFinish}
              members={state.members}
              onClose={api.onClose}
              onRemove={onRemoveMember}
              onChangeRole={onChangeMemberRole}
              disabled={closePrevented}
            />
          </Switch.Pane>
        </Switch>
      </Modal>

      {state.creating && (
        <Portal portalNode={document.body}>
          <TabLoader />
        </Portal>
      )}
    </>
  );
});

export default Create;
