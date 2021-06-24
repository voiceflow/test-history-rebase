import { Button, ButtonVariant, FlexCenter, toast, ToastCallToAction } from '@voiceflow/ui';
import React from 'react';

import { FeatureFlag } from '@/config/features';
import { goToTargetTranscript } from '@/ducks/router';
import * as Transcripts from '@/ducks/transcript';
import { connect, styled } from '@/hocs';
import { useFeature } from '@/hooks';
import { Identifier } from '@/styles/constants';
import { ConnectedProps } from '@/types';

export type PrototypeResetProps = {
  onClick: React.MouseEventHandler<HTMLSpanElement>;
  stepBack: () => void;
  goBackDisabled: boolean;
};

const Container = styled(FlexCenter)`
  height: 179px;
  background: white;
  border-top: solid 1px #eaeff4;
`;

const Splitter = styled.div`
  width: 1px;
  height: 16px;
  margin: 0 12px;
  background: #dfe3ed;
`;

const PrototypeReset: React.FC<PrototypeResetProps & ConnectedPrototypeResetProps> = ({
  savePrototypeSession,
  onClick,
  stepBack,
  goBackDisabled,
  goToTargetTranscript,
}) => {
  const testReports = useFeature(FeatureFlag.TEST_REPORTS);

  const onSave = () => {
    savePrototypeSession();
    toast.success(
      <>
        Test saved to Conversations <br />
        <ToastCallToAction
          onClick={() => {
            // TODO target the right transcript id
            goToTargetTranscript('1');
          }}
        >
          Go to conversation
        </ToastCallToAction>
      </>
    );
  };

  return (
    <Container>
      {!testReports.isEnabled && (
        <>
          <Button variant={ButtonVariant.TERTIARY} disabled={goBackDisabled} onClick={stepBack}>
            Go Back
          </Button>
          <Splitter />
        </>
      )}
      <Button variant={ButtonVariant.TERTIARY} id={Identifier.PROTOTYPE_RESET} onClick={onClick}>
        Reset Test
      </Button>
      {testReports.isEnabled && (
        <>
          <Splitter />
          <Button variant={ButtonVariant.TERTIARY} onClick={onSave}>
            Save Test
          </Button>
        </>
      )}
    </Container>
  );
};

const mapDispatchToProps = {
  savePrototypeSession: Transcripts.savePrototypeSession,
  goToTargetTranscript,
};

type ConnectedPrototypeResetProps = ConnectedProps<{}, typeof mapDispatchToProps>;

export default connect(null, mapDispatchToProps)(PrototypeReset) as React.FC<PrototypeResetProps>;
