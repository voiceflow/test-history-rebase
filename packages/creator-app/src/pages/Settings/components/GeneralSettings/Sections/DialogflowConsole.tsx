import { BoxFlex, Input } from '@voiceflow/ui';
import React from 'react';

import Section, { SectionVariant } from '@/components/Section';
import * as Version from '@/ducks/version';
import * as VersionV2 from '@/ducks/versionV2';
import { useDispatch, useSelector } from '@/hooks';

import { PlatformSettingsMetaProps } from '../../../constants';

interface DialogflowConsoleProps {
  platformMeta: PlatformSettingsMetaProps;
}

const sectionStyling = {
  paddingBottom: '24px',
};

const DialogflowConsole: React.FC<DialogflowConsoleProps> = ({ platformMeta }) => {
  const { descriptors } = platformMeta;
  const triggerPhrase = useSelector(VersionV2.active.dialogflow.triggerPhraseSelector);
  const [newTriggerPhrase, setNewTriggerPhrase] = React.useState(triggerPhrase[0] ?? 'Hello');
  const saveTriggerPhrase = useDispatch(Version.dialogflow.saveTriggerPhrase);

  const saveSettings = async () => {
    await Promise.all([saveTriggerPhrase([newTriggerPhrase])]);
  };

  return (
    <>
      <Section
        customContentStyling={sectionStyling}
        variant={SectionVariant.QUATERNARY}
        contentSuffix={descriptors.triggerPhraseDescriptor}
        header="Web Demo Trigger Phrase"
      >
        <BoxFlex>
          <Input
            value={newTriggerPhrase}
            onBlur={saveSettings}
            placeholder="Enter a phrase to trigger the Dialogflow web demo integration"
            onChangeText={setNewTriggerPhrase}
          />
        </BoxFlex>
      </Section>
    </>
  );
};

export default DialogflowConsole;
