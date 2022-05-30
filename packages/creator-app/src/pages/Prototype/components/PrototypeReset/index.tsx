import { BoxFlex, Button, ButtonVariant, ClickableText, Text, ThemeColor, TippyTooltip } from '@voiceflow/ui';
import React from 'react';

import { FeatureFlag } from '@/config/features';
import * as Feature from '@/ducks/feature';
import { useSelector } from '@/hooks';
import { Identifier } from '@/styles/constants';

import { Container } from './components';

export interface PrototypeResetProps {
  onClick: React.MouseEventHandler<HTMLSpanElement>;
  onSave: VoidFunction;
}

const PrototypeReset: React.FC<PrototypeResetProps> = ({ onSave, onClick }) => {
  const [transcriptSaved, setTranscriptSaved] = React.useState(true);
  const isTranscriptsMigrationOngoing = useSelector(Feature.isFeatureEnabledSelector)(FeatureFlag.TRANSCRIPTS_MIGRATION_ONGOING);
  return (
    <Container>
      <div>
        <Text color={ThemeColor.SECONDARY}>
          Conversation has ended.{' '}
          <ClickableText id={Identifier.PROTOTYPE_RESET} onClick={onClick}>
            Reset Test
          </ClickableText>{' '}
        </Text>
      </div>

      <BoxFlex justifyContent="flex-end">
        <TippyTooltip
          title="We are migrating transcripts information. Saving new transcripts is currently disabled"
          disabled={!isTranscriptsMigrationOngoing!}
        >
          <Button
            id={Identifier.SAVE_TRANSCRIPT_BUTTON}
            variant={ButtonVariant.PRIMARY}
            squareRadius
            onClick={() => {
              onSave();
              setTranscriptSaved(false);
            }}
            disabled={!transcriptSaved || isTranscriptsMigrationOngoing!}
          >
            Save
          </Button>
        </TippyTooltip>
      </BoxFlex>
    </Container>
  );
};

export default PrototypeReset;
