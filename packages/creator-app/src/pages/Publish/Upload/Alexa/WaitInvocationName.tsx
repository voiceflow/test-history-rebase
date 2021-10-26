import { Constants, Utils } from '@voiceflow/alexa-types';
import { BlockText, Box, BoxFlex, Button, ButtonVariant, IconVariant, Input, SvgIcon, TippyTooltip, useSmartReducerV2 } from '@voiceflow/ui';
import React from 'react';
import { Assign } from 'utility-types';

import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { connect } from '@/hocs';
import { AlexaExportJob, AlexaPublishJob } from '@/models';
import { ConnectedProps, Nullable } from '@/types';
import * as Sentry from '@/vendors/sentry';

import { ButtonContainer, Description, LoaderStage, StageContainer } from '../components';

interface WaitInvocationNameProps {
  stage: AlexaExportJob.WaitInvocationNameStage | AlexaPublishJob.WaitInvocationNameStage;
  updateCurrentStage: (data: unknown) => void;
}

const WaitInvocationName: React.FC<WaitInvocationNameProps & WaitInvocationNameConnectedProps> = ({
  stage,
  locales,
  invocationName,
  updateInvocationName,
  updateCurrentStage,
}) => {
  const [state, api] = useSmartReducerV2({
    name: invocationName as string,
    error: stage.data.error as Nullable<string>,
    loading: false,
  });

  const updateName = ({ target }: React.ChangeEvent<HTMLInputElement>) => {
    api.update({
      name: target.value,
      error: Utils.getInvocationNameError(target.value, locales),
    });
  };

  const submitNewName = async () => {
    if (state.error) {
      return;
    }

    api.loading.set(true);

    try {
      // save the name to backend and redux
      await updateInvocationName(state.name);
      await updateCurrentStage(state.name);
    } catch (err) {
      Sentry.error(err);
    }

    api.loading.set(false);
  };

  return state.loading ? (
    <LoaderStage>Updating Invocation Name</LoaderStage>
  ) : (
    <StageContainer>
      <BoxFlex mb="s">
        <BlockText color="secondary" fontWeight={600} mr={4}>
          Invocation Name
        </BlockText>

        <TippyTooltip
          html={
            <>
              Alexa listens for the Invocation Name
              <br /> to launch your Skill
              <br /> e.g.{' '}
              <i>
                Alexa, open <b>Invocation Name</b>
              </i>
            </>
          }
          position="bottom"
        >
          <SvgIcon icon="info" clickable variant={IconVariant.STANDARD} />
        </TippyTooltip>
      </BoxFlex>

      <Box mb="m">
        <Input value={state.name} placeholder="Invocation Name" onChange={updateName} />
      </Box>

      {state.error && (
        <Description>
          <small>{state.error}</small>
        </Description>
      )}

      <ButtonContainer>
        <Button variant={ButtonVariant.PRIMARY} onClick={submitNewName} disabled={!!state.error}>
          Continue
        </Button>
      </ButtonContainer>
    </StageContainer>
  );
};

const mapStateToProps = {
  locales: VersionV2.active.localesSelector,
  invocationName: VersionV2.active.invocationNameSelector,
};

const mapDispatchToProps = {
  updateInvocationName: Version.updateInvocationName,
};

type WaitInvocationNameConnectedProps = Assign<ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>, { locales: Constants.Locale[] }>;

export default connect(mapStateToProps, mapDispatchToProps)(WaitInvocationName) as React.FC<WaitInvocationNameProps>;
