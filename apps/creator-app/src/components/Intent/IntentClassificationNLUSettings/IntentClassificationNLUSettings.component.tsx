import { Box, Section, Slider } from '@voiceflow/ui-next';
import React from 'react';

import { SectionHeaderTitleWithLearnTooltip } from '@/components/Section/SectionHeaderTitleWithLearnTooltip/SectionHeaderTitleWithTooltip.component';
import { NLU_INTENT_CLASSIFICATION_CONFIDENCE_LEARN_MORE } from '@/constants/link.constant';
import { onOpenURLInANewTabFactory } from '@/utils/window';

import { IIntentClassificationNLUSettings } from './IntentClassificationNLUSettings.interface';

export const IntentClassificationNLUSettings: React.FC<IIntentClassificationNLUSettings> = ({ settings, disabled, onSettingsChange }) => {
  const onParamsChange = (value: Partial<IIntentClassificationNLUSettings['settings']['params']>) => {
    onSettingsChange({ ...settings, params: { ...settings.params, ...value } });
  };

  return (
    <>
      <Section.Header.Container
        variant="active"
        contentProps={{ pr: 24 }}
        title={(className) => (
          <SectionHeaderTitleWithLearnTooltip
            title="Intent confidence threshold"
            className={className}
            onLearnClick={onOpenURLInANewTabFactory(NLU_INTENT_CLASSIFICATION_CONFIDENCE_LEARN_MORE)}
          >
            The threshold of confidence needed to classify an intent.
          </SectionHeaderTitleWithLearnTooltip>
        )}
      >
        <Section.Header.Caption>{settings.params.confidence ?? 0}</Section.Header.Caption>
      </Section.Header.Container>

      <Box px={24} pb={20} direction="column">
        <Slider
          min={0}
          max={1}
          marks={[0, 1]}
          value={settings.params.confidence}
          disabled={disabled}
          endLabel="100%"
          startLabel="0%"
          onValueChange={(confidence) => onParamsChange({ confidence })}
        />
      </Box>
    </>
  );
};
