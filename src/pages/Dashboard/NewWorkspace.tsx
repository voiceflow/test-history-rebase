import { History } from 'history';
import _noop from 'lodash/noop';
import React from 'react';

import Button from '@/components/Button';
import { FlexCenter } from '@/components/Flex';
import { ClickableText } from '@/components/Text';
import { toast } from '@/components/Toast';
import { UploadJustIcon } from '@/components/Upload/ImageUpload/IconUpload';
import { ModalType } from '@/constants';
import * as Workspace from '@/ducks/workspace';
import { connect } from '@/hocs';
import { useModals } from '@/hooks';
import { Container, LabelContainer, NameInput } from '@/pages/Onboarding/Steps/CreateWorkspace/components';
import { InnerContainer, OuterContainer } from '@/pages/Onboarding/components';
import { ActionButton, Container as HeaderContainer } from '@/pages/Onboarding/components/Header/components';
import { Container as HeaderTitleContainer, Title } from '@/pages/Onboarding/components/Header/components/StepStatus/components';
import { FadeDownContainer } from '@/styles/animations';
import { ConnectedProps } from '@/types';

const IconUpload: React.FC<any> = UploadJustIcon;

export type NewWorkspaceProps = {
  history: History;
};

const NewWorkspace: React.FC<NewWorkspaceProps & ConnectedNewWorkspaceProps> = ({ history, createWorkspace }) => {
  const [name, setName] = React.useState('');
  const [image, setImage] = React.useState('');
  const { open: openSuccessModal } = useModals(ModalType.SUCCESS);
  const canContinue = !!name.trim() && name.length <= 32;
  const iconUploadRef = React.createRef<HTMLElement>();

  const onBlur = () => {
    if (name.length > 32) {
      toast.error('Workspace Name Too Long - 32 Characters Max');
    }
  };

  const onContinue = React.useCallback(async () => {
    const newWorkspace = await createWorkspace({ name, image: image || undefined });

    if (newWorkspace && newWorkspace.id) {
      history.push(`/workspace/${newWorkspace.id}`);

      openSuccessModal({
        icon: '/images/takeoff.svg',
        title: 'Success',
        message: `Your workplace ${newWorkspace.name} has been successfully created`,
      });
    } else {
      history.push('/dashboard');
    }
  }, [createWorkspace, name, image, history, openSuccessModal]);

  return (
    <FadeDownContainer>
      <OuterContainer>
        <InnerContainer>
          <HeaderContainer>
            <ActionButton icon="back" label="Close" onClick={_noop} shouldRender={false} />

            <HeaderTitleContainer>
              <Title>Create Workspace</Title>
            </HeaderTitleContainer>

            <ActionButton
              icon="close"
              label="Close"
              onClick={() => {
                history.push('/dashboard');
              }}
              shouldRender
            />
          </HeaderContainer>

          <FlexCenter>
            <Container>
              <FlexCenter>
                <NameInput
                  value={name}
                  onBlur={onBlur}
                  onChange={(e: React.FormEvent<HTMLInputElement>) => setName(e.currentTarget.value)}
                  // eslint-disable-next-line jsx-a11y/no-autofocus
                  autoFocus
                  placeholder="Enter your workspace name"
                />
              </FlexCenter>

              <FlexCenter>
                <IconUpload image={image} update={setImage} size="large" ref={iconUploadRef} />
              </FlexCenter>

              <LabelContainer>
                Drop workspace icon here <br />
                or <ClickableText onClick={() => iconUploadRef.current?.click()}>Browse</ClickableText> (optional)
              </LabelContainer>

              <FlexCenter>
                <Button disabled={!canContinue} variant="primary" onClick={onContinue}>
                  Continue
                </Button>
              </FlexCenter>
            </Container>
          </FlexCenter>
        </InnerContainer>
      </OuterContainer>
    </FadeDownContainer>
  );
};

const mapDispatchToProps = {
  createWorkspace: Workspace.createWorkspace,
};

type ConnectedNewWorkspaceProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(NewWorkspace);
