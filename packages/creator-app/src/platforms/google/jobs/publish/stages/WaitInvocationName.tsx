import { Nullable } from '@voiceflow/common';
import { GoogleUtils } from '@voiceflow/google-types';
import { BlockText, Box, BoxFlex, Button, ButtonVariant, Input, SvgIcon, TippyTooltip, useSmartReducerV2 } from '@voiceflow/ui';
import React from 'react';

import { ButtonContainer, Description, LoaderStage, StageContainer } from '@/components/PlatformUploadPopup/components';
import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { useDispatch, useSelector } from '@/hooks';
import { GooglePublishJob } from '@/models';
import { StageComponentProps } from '@/platforms/types';
import * as Sentry from '@/vendors/sentry';

const WaitInvocationName: React.FC<StageComponentProps<GooglePublishJob.WaitInvocationNameStage>> = ({ stage, updateCurrentStage }) => {
  const locales = useSelector(VersionV2.active.localesSelector);
  const invocationName = useSelector(VersionV2.active.invocationNameSelector);
  const updateInvocationName = useDispatch(Version.updateInvocationName);

  const [state, api] = useSmartReducerV2({
    name: invocationName as string,
    error: stage.data.error as Nullable<string>,
    loading: false,
  });

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

  return (
    <StageContainer width={254}>
      {state.loading ? (
        <LoaderStage />
      ) : (
        <>
          <BoxFlex mb="s">
            <BlockText color="secondary" fontWeight={600} mr={4}>
              Invocation Name
            </BlockText>
            <TippyTooltip
              html={
                <>
                  Google listens for the Invocation Name
                  <br /> to launch your Skill
                  <br /> e.g.{' '}
                  <i>
                    Okay Google, open <b>Invocation Name</b>
                  </i>
                </>
              }
              position="bottom"
            >
              <SvgIcon icon="info" clickable variant={SvgIcon.Variant.STANDARD} />
            </TippyTooltip>
          </BoxFlex>

          <Box mb="m">
            <Input
              value={state.name}
              placeholder="Invocation Name"
              onChangeText={(value) => api.update({ name: value, error: GoogleUtils.getInvocationNameError(value, locales) })}
            />
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
        </>
      )}
    </StageContainer>
  );
};

export default WaitInvocationName;
