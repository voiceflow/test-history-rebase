import React from 'react';

import Box, { Flex } from '@/components/Box';
import Button, { ButtonVariant } from '@/components/Button';
import Input from '@/components/Input';
import SvgIcon, { IconVariant } from '@/components/SvgIcon';
import { BlockText } from '@/components/Text';
import TippyTooltip from '@/components/TippyTooltip';
import * as Skill from '@/ducks/skill';
import { saveInvocationName } from '@/ducks/skill/sideEffectsV2';
import { connect } from '@/hocs';
import { useSmartReducerV2 } from '@/hooks';
import { AlexaExportJob, AlexaPublishJob } from '@/models';
import { getAmazonInvocationNameError } from '@/pages/Publish/utils';
import { ConnectedProps, Nullable } from '@/types';

import { ButtonContainer, Description, LoaderStage, StageContainer } from '../components';

type WaitInvocationNameProps = {
  stage: AlexaExportJob.WaitInvocationNameStage | AlexaPublishJob.WaitInvocationNameStage;
  updateCurrentStage: (data: unknown) => void;
};

const WaitInvocationName: React.FC<WaitInvocationNameProps & WaitInvocationNameConnectedProps> = ({
  stage,
  locales,
  invocationName,
  saveInvocationName,
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
      error: getAmazonInvocationNameError(target.value, locales),
    });
  };

  const submitNewName = async () => {
    if (state.error) {
      return;
    }

    api.loading.set(true);

    try {
      // save the name to backend and redux
      await saveInvocationName(state.name);
      await updateCurrentStage(state.name);
    } catch (err) {
      console.error(err);
    }

    api.loading.set(false);
  };

  return state.loading ? (
    <LoaderStage>Updating Invocation Name</LoaderStage>
  ) : (
    <StageContainer>
      <Flex mb="s">
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
      </Flex>

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
  locales: Skill.activeLocalesSelector,
  invocationName: Skill.invNameSelector,
};

const mapDispatchToProps = {
  saveInvocationName,
};

type WaitInvocationNameConnectedProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(WaitInvocationName) as React.FC<WaitInvocationNameProps>;
