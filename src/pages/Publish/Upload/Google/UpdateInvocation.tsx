import React, { useState } from 'react';
import { Tooltip } from 'react-tippy';

import { Flex } from '@/components/Box';
import Button, { ButtonVariant } from '@/components/Button';
import Input from '@/components/Input';
import SvgIcon, { IconVariant } from '@/components/SvgIcon';
import { BlockText } from '@/components/Text';
import { checkInvocationName } from '@/ducks/publish/google';
import { invNameError } from '@/ducks/publish/utils';
import { activeLocalesSelector, invNameSelector, updateInvName } from '@/ducks/skill';
import { connect } from '@/hocs';
import { ConnectedProps } from '@/types';

import { IndefiniteLoading } from '../common/Loading';
import { PopUpText, PopupButtonSection, UploadPromptWrapper } from '../styled';

const UpdateInvocation: React.FC<ConnectedUpdateInvocationProps> = ({ updateInvName, checkInvocationName, invName, locales = [] }) => {
  const [name, setName] = useState(invName);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(invNameError(name, locales));

  const updateName = (e: any) => {
    const name = e.target.value;
    setName(name);
    setError(invNameError(name, locales));
  };

  const submitNewName = async () => {
    if (error) return;
    setLoading(true);
    try {
      // save the name to backend and redux
      await updateInvName(name);
      // check status again
      checkInvocationName();
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  if (loading) return <IndefiniteLoading message="Updating Invocation Name" />;

  return (
    <UploadPromptWrapper>
      <Flex mb="s">
        <BlockText color="secondary" fontWeight={600} mr={4}>
          Invocation Name
        </BlockText>
        <Tooltip
          html={
            <>
              Google listens for the Invocation Name
              <br /> to launch your Skill
              <br /> e.g.{' '}
              <i>
                Hey Google, open <b>Invocation Name</b>
              </i>
            </>
          }
          position="bottom"
        >
          <SvgIcon icon="info" clickable variant={IconVariant.STANDARD} />
        </Tooltip>
      </Flex>
      <Input value={name} placeholder="Invocation Name" onChange={updateName} />
      <PopUpText>
        <small>{error}</small>
      </PopUpText>
      <PopupButtonSection>
        <Button variant={ButtonVariant.PRIMARY} onClick={submitNewName} disabled={!!error}>
          Continue
        </Button>
      </PopupButtonSection>
    </UploadPromptWrapper>
  );
};

const mapStateToProps = {
  invName: invNameSelector,
  locales: activeLocalesSelector,
};

const mapDispatchToProps = {
  checkInvocationName,
  updateInvName,
};

type ConnectedUpdateInvocationProps = ConnectedProps<typeof mapStateToProps, typeof mapDispatchToProps>;

export default connect(mapStateToProps, mapDispatchToProps)(UpdateInvocation);
