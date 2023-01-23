import { Nullable, Utils } from '@voiceflow/common';
import { UserRole } from '@voiceflow/internal';
import * as Platform from '@voiceflow/platform-config';
import * as Realtime from '@voiceflow/realtime-sdk';
import { FullSpinner, IconButton, Modal, Portal, SectionV2, Switch, toast, useSmartReducerV2 } from '@voiceflow/ui';
import React from 'react';

import * as Account from '@/ducks/account';
import { useFeature } from '@/hooks/feature';
import { useSelector } from '@/hooks/redux';
import { NLUImportModel } from '@/models';
import { ClassName } from '@/styles/constants';

import manager from '../../../manager';
import { Screen } from './constants';
import { useProjectCreate } from './hooks';
import { ChooseType, Members, NLUSetup, PlatformSetup } from './screens';

const Create = manager.create<{ listID?: string }>('CreateProject', () => ({ api, type, opened, listID, hidden, animated }) => {
  const userID = useSelector(Account.userIDSelector)!;

  const dashboardV2 = useFeature(Realtime.FeatureFlag.DASHBOARD_V2);

  const [state, stateAPI] = useSmartReducerV2({
    nlu: null as Nullable<Platform.Constants.NLUType>,
    name: '',
    type: null as Nullable<Platform.Constants.ProjectType>,
    image: null as Nullable<string>,
    screen: Screen.CHOOSE_TYPE,
    locales: [] as string[],
    creating: false,
    platform: null as Nullable<Platform.Constants.PlatformType>,
    memberIDs: [userID] as number[],
    secondScreen: null as Nullable<Screen.NLU_SETUP | Screen.PLATFORM_SETUP>,
    importedModel: null as Nullable<NLUImportModel>,
    memberRolesMap: { [userID]: [UserRole.EDITOR] } as Partial<Record<number, UserRole[]>>,
  });

  const onCreateProject = useProjectCreate();

  const onChoseTypeNext = ({ name, image, screen }: { name: string; image: Nullable<string>; screen: Screen.NLU_SETUP | Screen.PLATFORM_SETUP }) => {
    if (screen !== state.secondScreen) {
      stateAPI.reset();
    }

    stateAPI.update({ name, image, secondScreen: screen, screen });
  };

  const onBack = () => {
    if (state.screen === Screen.MEMBERS && state.secondScreen) {
      stateAPI.update({ screen: state.secondScreen });
    } else {
      stateAPI.update({ screen: Screen.CHOOSE_TYPE });
    }
  };

  const onFinish = async () => {
    if (!state.nlu || !state.type || !state.platform) return;

    try {
      stateAPI.update({ creating: true });

      await onCreateProject({
        nlu: state.nlu,
        name: state.name,
        type: state.type,
        image: state.image,
        listID,
        locales: state.locales,
        platform: state.platform,
        importedModel: state.importedModel,
      });

      api.close();
    } catch {
      stateAPI.update({ creating: false });
      toast.error('Failed to create assistant, please try again later');
    }
  };

  const onPlatformOrNLUSetupNext = () => {
    if (dashboardV2.isEnabled) {
      stateAPI.update({ screen: Screen.MEMBERS });
    } else {
      onFinish();
    }
  };

  const onAddMember = (memberID: number) => {
    stateAPI.update(({ memberIDs, memberRolesMap }) => ({
      memberIDs: [...memberIDs, memberID],
      memberRolesMap: { ...memberRolesMap, [memberID]: [UserRole.EDITOR] },
    }));
  };

  const onRemoveMember = (memberID: number) => {
    stateAPI.update(({ memberIDs, memberRolesMap }) => ({
      memberIDs: memberIDs.filter((id) => id !== memberID),
      memberRolesMap: Utils.object.omit(memberRolesMap, [memberID]),
    }));
  };

  const onChangeMemberRoles = (memberID: number, roles: UserRole[]) => {
    stateAPI.update(({ memberRolesMap }) => ({
      memberRolesMap: { ...memberRolesMap, [memberID]: roles },
    }));
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
        <Modal.Header border actions={<Modal.Header.CloseButton onClick={() => api.close()} />}>
          {state.screen !== Screen.CHOOSE_TYPE && (
            <SectionV2.ActionsContainer isLeft unit={0} offsetUnit={2.75}>
              <IconButton icon="largeArrowLeft" onClick={() => onBack()} variant={IconButton.Variant.BASIC} />
            </SectionV2.ActionsContainer>
          )}

          <Modal.Header.Title large>Create Assistant</Modal.Header.Title>
        </Modal.Header>

        <Switch active={state.screen}>
          <Switch.Pane value={Screen.CHOOSE_TYPE}>
            <ChooseType name={state.name} image={state.image} screen={state.secondScreen} onNext={onChoseTypeNext} onClose={api.close} />
          </Switch.Pane>

          <Switch.Pane value={Screen.PLATFORM_SETUP}>
            <PlatformSetup
              type={state.type}
              onNext={onPlatformOrNLUSetupNext}
              onClose={api.close}
              locales={state.locales}
              platform={state.platform}
              onChangeLocales={stateAPI.locales.set}
              onChangePlatform={({ nlu, type, platform }) => stateAPI.update({ nlu, type, platform, locales: [] })}
            />
          </Switch.Pane>

          <Switch.Pane value={Screen.NLU_SETUP}>
            <NLUSetup
              nlu={state.nlu}
              type={state.type}
              onNext={onPlatformOrNLUSetupNext}
              onClose={api.close}
              locales={state.locales}
              platform={state.platform}
              onChangeNLU={({ nlu, platform }) => stateAPI.update({ platform, nlu, locales: [] })}
              importModel={state.importedModel}
              onChangeType={stateAPI.type.set}
              onImportModel={stateAPI.importedModel.set}
              onChangeLocales={stateAPI.locales.set}
            />
          </Switch.Pane>

          <Switch.Pane value={Screen.MEMBERS}>
            <Members
              onAdd={onAddMember}
              onNext={onFinish}
              onClose={api.close}
              onRemove={onRemoveMember}
              memberIDs={state.memberIDs}
              onChangeRoles={onChangeMemberRoles}
              memberRolesMap={state.memberRolesMap}
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
